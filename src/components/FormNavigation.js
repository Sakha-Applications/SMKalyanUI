import React from "react";
import { Box, Button } from "@mui/material";

const FormNavigation = ({ tabIndex, setTabIndex, showSubmitButton = false, handleSubmit = null }) => {
  return (
    <Box sx={{
      display: "flex",
      justifyContent: "space-between",
      mt: 3,
      gridColumn: "1 / span 2" // Make it span the two columns of CareerEducationTab
    }}>
      <Button
        onClick={() => setTabIndex(tabIndex - 1)}
        disabled={tabIndex === 0}
        variant="contained"
        color="secondary"
      >
        Back
      </Button>

      {showSubmitButton ? (
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      ) : (
        <Button
          onClick={() => setTabIndex(tabIndex + 1)}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      )}
    </Box>
  );
};

export default FormNavigation;