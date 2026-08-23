import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  SelectChangeEvent,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { RootState, AppDispatch } from '../store';
import settingsService from '../services/settingsService';
import { setLoading, setSaveLoading, setError, setSettings, clearError } from '../store/slices/settingsSlice';
import { SUPPORTED_CURRENCIES, MONTHS } from '../types/settings';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading, error, saveLoading } = useSelector(
    (state: RootState) => state.settings
  );

  const [formData, setFormData] = useState({
    madrasaName: '',
    address: '',
    phone: '',
    email: '',
    currency: 'INR',
    financialYearStart: 1,
    financialYearEnd: 12,
    website: '',
    taxId: '',
    registrationNumber: '',
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setFormData({
        madrasaName: settings.madrasaName,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        currency: settings.currency,
        financialYearStart: settings.financialYearStart,
        financialYearEnd: settings.financialYearEnd,
        website: settings.website || '',
        taxId: settings.taxId || '',
        registrationNumber: settings.registrationNumber || '',
      });
      if (settings.logo) {
        setLogoPreview(settings.logo);
      }
    }
  }, [settings]);

  const loadSettings = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const response = await settingsService.getSettings();
      dispatch(setSettings(response));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load settings';
      dispatch(setError(message));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value?: unknown }> | SelectChangeEvent<any>) => {
    const target = e.target as any;
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'financialYearStart' || name === 'financialYearEnd' ? parseInt(value) : value,
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      dispatch(setSaveLoading(true));
      dispatch(clearError());

      const response = await settingsService.uploadLogo(file);
      dispatch(setSettings(response));

      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload logo';
      dispatch(setError(message));
    }
  };

  const handleSave = async () => {
    try {
      dispatch(setSaveLoading(true));
      dispatch(clearError());

      const response = await settingsService.updateSettings(formData);
      dispatch(setSettings(response));
      dispatch(setError(null));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save settings';
      dispatch(setError(message));
    }
  };

  if (loading && !settings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Configure your Madrasa information and financial settings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Logo Upload */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Madrasa Logo
            </Typography>
            {logoPreview && (
              <Box
                component="img"
                src={logoPreview}
                alt="Logo preview"
                sx={{ maxWidth: '100%', maxHeight: 150, mb: 2 }}
              />
            )}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={saveLoading}
            >
              Upload Logo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />
            </Button>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              PNG, JPG or GIF (max 2MB)
            </Typography>
          </Paper>
        </Grid>

        {/* Settings Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Madrasa Name"
                  name="madrasaName"
                  value={formData.madrasaName}
                  onChange={handleInputChange}
                  disabled={saveLoading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  disabled={saveLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={saveLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={saveLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={saveLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    name="currency"
                    value={formData.currency}
                    label="Currency"
                    onChange={handleInputChange}
                    disabled={saveLoading}
                  >
                    {SUPPORTED_CURRENCIES.map((curr) => (
                      <MenuItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tax ID"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  disabled={saveLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Registration Number"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  disabled={saveLoading}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Financial Year
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Start Month</InputLabel>
                  <Select
                    name="financialYearStart"
                    value={formData.financialYearStart}
                    label="Start Month"
                    onChange={handleInputChange}
                    disabled={saveLoading}
                  >
                    {MONTHS.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>End Month</InputLabel>
                  <Select
                    name="financialYearEnd"
                    value={formData.financialYearEnd}
                    label="End Month"
                    onChange={handleInputChange}
                    disabled={saveLoading}
                  >
                    {MONTHS.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saveLoading}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {saveLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Last Updated Info */}
      {settings && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SettingsPage;
