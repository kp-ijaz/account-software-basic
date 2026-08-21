using System.Security.Cryptography;
using System.Text;
using MadrasaAccounting.Domain.Interfaces;

namespace MadrasaAccounting.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    private const int SaltLength = 16; // 128 bits
    private const int HashLength = 32; // 256 bits
    private const int Iterations = 10000; // PBKDF2 iterations

    /// <summary>
    /// Hashes a password using PBKDF2 with SHA-256
    /// Format: $PBKDF2$iterations$salt$hash
    /// </summary>
    public string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password cannot be empty", nameof(password));

        // Generate random salt
        using var rng = new RNGCryptoServiceProvider();
        byte[] salt = new byte[SaltLength];
        rng.GetBytes(salt);

        // Hash password
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
        byte[] hash = pbkdf2.GetBytes(HashLength);

        // Combine salt and hash
        byte[] saltAndHash = new byte[salt.Length + hash.Length];
        Buffer.BlockCopy(salt, 0, saltAndHash, 0, salt.Length);
        Buffer.BlockCopy(hash, 0, saltAndHash, salt.Length, hash.Length);

        // Format: $PBKDF2$iterations$base64_salt_and_hash
        string base64SaltAndHash = Convert.ToBase64String(saltAndHash);
        return $"$PBKDF2${Iterations}${base64SaltAndHash}";
    }

    /// <summary>
    /// Verifies a password against a hash
    /// </summary>
    public bool VerifyPassword(string password, string hash)
    {
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password cannot be empty", nameof(password));

        if (string.IsNullOrWhiteSpace(hash))
            return false;

        try
        {
            // Parse hash format
            string[] parts = hash.Split('$');
            if (parts.Length != 4 || parts[1] != "PBKDF2")
                return false;

            int iterations = int.Parse(parts[2]);
            byte[] saltAndHash = Convert.FromBase64String(parts[3]);

            // Extract salt and stored hash
            byte[] salt = new byte[SaltLength];
            byte[] storedHash = new byte[HashLength];
            Buffer.BlockCopy(saltAndHash, 0, salt, 0, SaltLength);
            Buffer.BlockCopy(saltAndHash, SaltLength, storedHash, 0, HashLength);

            // Hash provided password with extracted salt
            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
            byte[] computedHash = pbkdf2.GetBytes(HashLength);

            // Compare hashes using constant-time comparison
            return ConstantTimeComparison(storedHash, computedHash);
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Constant-time comparison to prevent timing attacks
    /// </summary>
    private static bool ConstantTimeComparison(byte[] a, byte[] b)
    {
        if (a.Length != b.Length)
            return false;

        int result = 0;
        for (int i = 0; i < a.Length; i++)
        {
            result |= a[i] ^ b[i];
        }

        return result == 0;
    }
}
