import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const DynamicForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [formStructure, setFormStructure] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      const rollNumber = localStorage.getItem("rollNumber");
      if (!rollNumber) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(
          `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`
        );
        setFormStructure(response.data.form);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch form structure");
        setLoading(false);
      }
    };

    fetchForm();
  }, [navigate]);

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear error for this field when user makes a change
    setErrors((prev) => ({
      ...prev,
      [fieldId]: "",
    }));
  };

  const validateSection = (section) => {
    const sectionErrors = {};
    let isValid = true;

    section.fields.forEach((field) => {
      const value = formData[field.fieldId];

      if (field.required && !value) {
        sectionErrors[field.fieldId] = "This field is required";
        isValid = false;
      }

      if (value) {
        if (field.minLength && value.length < field.minLength) {
          sectionErrors[field.fieldId] = `Minimum length is ${field.minLength}`;
          isValid = false;
        }

        if (field.maxLength && value.length > field.maxLength) {
          sectionErrors[field.fieldId] = `Maximum length is ${field.maxLength}`;
          isValid = false;
        }

        if (field.type === "email" && !/\S+@\S+\.\S+/.test(value)) {
          sectionErrors[field.fieldId] = "Invalid email format";
          isValid = false;
        }
      }
    });

    setErrors(sectionErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateSection(formStructure.sections[currentSection])) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentSection((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateSection(formStructure.sections[currentSection])) {
      console.log("Form Data:", formData);
      // Here you would typically send the data to your backend
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!formStructure) {
    return null;
  }

  const currentSectionData = formStructure.sections[currentSection];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {formStructure.formTitle}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Section {currentSection + 1} of {formStructure.sections.length}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              {currentSectionData.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {currentSectionData.description}
            </Typography>

            {currentSectionData.fields.map((field) => (
              <Box key={field.fieldId} sx={{ mb: 3 }}>
                {field.type === "text" && (
                  <TextField
                    fullWidth
                    label={field.label}
                    value={formData[field.fieldId] || ""}
                    onChange={(e) =>
                      handleChange(field.fieldId, e.target.value)
                    }
                    error={!!errors[field.fieldId]}
                    helperText={errors[field.fieldId]}
                    required={field.required}
                    placeholder={field.placeholder}
                    inputProps={{ "data-testid": field.dataTestId }}
                  />
                )}

                {field.type === "email" && (
                  <TextField
                    fullWidth
                    type="email"
                    label={field.label}
                    value={formData[field.fieldId] || ""}
                    onChange={(e) =>
                      handleChange(field.fieldId, e.target.value)
                    }
                    error={!!errors[field.fieldId]}
                    helperText={errors[field.fieldId]}
                    required={field.required}
                    placeholder={field.placeholder}
                    inputProps={{ "data-testid": field.dataTestId }}
                  />
                )}

                {field.type === "tel" && (
                  <TextField
                    fullWidth
                    type="tel"
                    label={field.label}
                    value={formData[field.fieldId] || ""}
                    onChange={(e) =>
                      handleChange(field.fieldId, e.target.value)
                    }
                    error={!!errors[field.fieldId]}
                    helperText={errors[field.fieldId]}
                    required={field.required}
                    placeholder={field.placeholder}
                    inputProps={{ "data-testid": field.dataTestId }}
                  />
                )}

                {field.type === "textarea" && (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={field.label}
                    value={formData[field.fieldId] || ""}
                    onChange={(e) =>
                      handleChange(field.fieldId, e.target.value)
                    }
                    error={!!errors[field.fieldId]}
                    helperText={errors[field.fieldId]}
                    required={field.required}
                    placeholder={field.placeholder}
                    inputProps={{ "data-testid": field.dataTestId }}
                  />
                )}

                {field.type === "date" && (
                  <TextField
                    fullWidth
                    type="date"
                    label={field.label}
                    value={formData[field.fieldId] || ""}
                    onChange={(e) =>
                      handleChange(field.fieldId, e.target.value)
                    }
                    error={!!errors[field.fieldId]}
                    helperText={errors[field.fieldId]}
                    required={field.required}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ "data-testid": field.dataTestId }}
                  />
                )}

                {field.type === "dropdown" && (
                  <FormControl fullWidth error={!!errors[field.fieldId]}>
                    <FormLabel>{field.label}</FormLabel>
                    <Select
                      value={formData[field.fieldId] || ""}
                      onChange={(e) =>
                        handleChange(field.fieldId, e.target.value)
                      }
                      required={field.required}
                      inputProps={{ "data-testid": field.dataTestId }}
                    >
                      {field.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors[field.fieldId] && (
                      <FormHelperText>{errors[field.fieldId]}</FormHelperText>
                    )}
                  </FormControl>
                )}

                {field.type === "radio" && (
                  <FormControl error={!!errors[field.fieldId]}>
                    <FormLabel>{field.label}</FormLabel>
                    <RadioGroup
                      value={formData[field.fieldId] || ""}
                      onChange={(e) =>
                        handleChange(field.fieldId, e.target.value)
                      }
                    >
                      {field.options?.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                          data-testid={option.dataTestId}
                        />
                      ))}
                    </RadioGroup>
                    {errors[field.fieldId] && (
                      <FormHelperText>{errors[field.fieldId]}</FormHelperText>
                    )}
                  </FormControl>
                )}

                {field.type === "checkbox" && (
                  <FormControl error={!!errors[field.fieldId]}>
                    <FormLabel>{field.label}</FormLabel>
                    {field.options?.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={
                              formData[field.fieldId]?.includes(option.value) ||
                              false
                            }
                            onChange={(e) => {
                              const currentValues =
                                formData[field.fieldId] || [];
                              const newValues = e.target.checked
                                ? [...currentValues, option.value]
                                : currentValues.filter(
                                    (v) => v !== option.value
                                  );
                              handleChange(field.fieldId, newValues);
                            }}
                            data-testid={option.dataTestId}
                          />
                        }
                        label={option.label}
                      />
                    ))}
                    {errors[field.fieldId] && (
                      <FormHelperText>{errors[field.fieldId]}</FormHelperText>
                    )}
                  </FormControl>
                )}
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              onClick={handlePrev}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            {currentSection === formStructure.sections.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DynamicForm;
