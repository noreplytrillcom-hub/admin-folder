import GoogleIcon from "@mui/icons-material/Google";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Failed to authenticate with Google SSO.");
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            textAlign: "center",
            width: "100%",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            fontWeight="bold"
            gutterBottom
          >
            Admin Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in using your authorized company email via SSO
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <GoogleIcon />
              )
            }
            onClick={handleLogin}
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              backgroundColor: "#4285F4",
              "&:hover": { backgroundColor: "#357ae8" },
            }}
          >
            {isSubmitting ? "Redirecting..." : "Sign in with Google"}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
