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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { signInWithGoogle, user, authError } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard as soon as authorization is confirmed
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Failed to sign in with Google.");
      setIsSubmitting(false);
    }
  };

  const displayError = error || authError;

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

          {displayError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {displayError}
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
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              backgroundColor: "#4285F4",
              "&:hover": { backgroundColor: "#357ae8" },
            }}
          >
            {isSubmitting ? "Connecting..." : "Sign in with Google"}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
