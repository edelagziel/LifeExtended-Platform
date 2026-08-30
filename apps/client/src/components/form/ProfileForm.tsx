import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Slider,
    Checkbox,
  } from "@mui/material";
  
  import { useProfileForm } from "./useProfileForm";
  
  function ProfileForm() {
    const { formData, updateField, submitProfile } = useProfileForm();
  
    function onSubmit(e: React.FormEvent) {
      e.preventDefault();
      submitProfile();
    }
  
    return (
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            Tell us about yourself
          </Typography>
          <Typography color="text.secondary">
            This information helps us personalize your health insights and risk
            analysis.
          </Typography>
        </Box>
  
        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 4 }}>
          {/* Section A – Basic Info */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Basic information
            </Typography>
  
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 260px" }}>
                <TextField
                  label="Height (cm)"
                  type="number"
                  fullWidth
                  value={formData.heightCm}
                  onChange={(e) =>
                    updateField("heightCm", Number(e.target.value))
                  }
                />
              </Box>
  
              <Box sx={{ flex: "1 1 260px" }}>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  fullWidth
                  value={formData.weightKg}
                  onChange={(e) =>
                    updateField("weightKg", Number(e.target.value))
                  }
                />
              </Box>
  
              <Box sx={{ flex: "1 1 260px" }}>
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  value={formData.age}
                  onChange={(e) => updateField("age", Number(e.target.value))}
                />
              </Box>
            </Box>
  
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Gender</Typography>
              <RadioGroup
                row
                value={formData.gender}
                onChange={(e) =>
                  updateField("gender", e.target.value as any)
                }
              >
                {["male", "female", "other"].map((g) => (
                  <FormControlLabel
                    key={g}
                    value={g}
                    control={<Radio />}
                    label={g}
                  />
                ))}
              </RadioGroup>
            </Box>
          </Box>
  
          {/* Section B – Lifestyle */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Lifestyle
            </Typography>
  
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 260px" }}>
                <Typography variant="subtitle2">Activity level</Typography>
                <RadioGroup
                  row
                  value={formData.activityLevel}
                  onChange={(e) =>
                    updateField("activityLevel", e.target.value as any)
                  }
                >
                  {["low", "moderate", "high"].map((l) => (
                    <FormControlLabel
                      key={l}
                      value={l}
                      control={<Radio />}
                      label={l}
                    />
                  ))}
                </RadioGroup>
              </Box>
  
              <Box sx={{ flex: "1 1 260px" }}>
                <Typography variant="subtitle2">Sleep quality</Typography>
                <RadioGroup
                  row
                  value={formData.sleepQuality}
                  onChange={(e) =>
                    updateField("sleepQuality", e.target.value as any)
                  }
                >
                  {["poor", "average", "good"].map((s) => (
                    <FormControlLabel
                      key={s}
                      value={s}
                      control={<Radio />}
                      label={s}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </Box>
  
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Stress level</Typography>
              <Slider
                min={1}
                max={5}
                step={1}
                marks
                value={formData.stressLevel}
                onChange={(_, v) =>
                  updateField("stressLevel", v as number)
                }
              />
            </Box>
  
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.smoking}
                    onChange={(e) =>
                      updateField("smoking", e.target.checked)
                    }
                  />
                }
                label="Smoking"
              />
            </Box>
          </Box>
  
          {/* CTA */}
          <Box sx={{ textAlign: "right" }}>
            <Button type="submit" variant="contained" size="large">
              Save profile & analyze my status
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }
  
  export default ProfileForm;
  