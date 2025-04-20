import React, { useState } from 'react';
import { Container, Box, Tab, Tabs, Typography, Button, CircularProgress, Paper, Avatar } from '@mui/material';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh' 
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (user) {
    return (
      <Container maxWidth="sm">
        <Box 
          sx={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              width: '100%',
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
            }}
          >
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                margin: '0 auto 16px',
                backgroundColor: 'primary.main'
              }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome back!
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
              {user.email}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={logout}
              sx={{ 
                mt: 2,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                }
              }}
              startIcon={<LogoutIcon />}
            >
              Sign Out
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pt: 4,
          pb: 8
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
          }}
        >
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              mb: 4
            }}
          >
            {tabValue === 0 ? 'Welcome back!' : 'Create account'}
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="authentication tabs"
            centered
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
                minWidth: 120,
              }
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <LoginForm />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <RegisterForm />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
} 