import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { gql } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { SHA256 } from 'crypto-js';

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        id
        email
        createdAt
      }
    }
  }
`;

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const password = watch('password');

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      login(data.register.token, data.register.user);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      // Hash password with SHA-256 before sending
      const hashedPassword = SHA256(data.password).toString();
      await registerMutation({
        variables: {
          email: data.email,
          password: hashedPassword,
        },
      });
    } catch (err) {
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email address"
        type="email"
        variant="outlined"
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
      />

      <TextField
        fullWidth
        label="Confirm password"
        type={showConfirmPassword ? 'text' : 'password'}
        variant="outlined"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={handleClickShowConfirmPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: value => value === password || 'Passwords do not match'
        })}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1.1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          }
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Create Account'
        )}
      </Button>
    </Box>
  );
}; 