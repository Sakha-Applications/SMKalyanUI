import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results }) => {
  const navigate = useNavigate();
  const [hoverMessage, setHoverMessage] = useState(null);

  useEffect(() => {
    if (results && results.length > 0) {
   //   setHoverMessage('Click anywhere to go to the main page for more details.');
    } else {
      setHoverMessage(null);
    }
  }, [results]);

  const handlePaperClick = () => {
    if (results && results.length > 0) {
      alert('To see more details, please log in or register.');
      navigate('/');
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 2, marginTop: 3, cursor: results && results.length > 0 ? 'pointer' : 'default' }}
      onClick={handlePaperClick}
    >
      <Typography variant="h6">Search Results</Typography>
      {hoverMessage && (
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', marginBottom: 1 }}>
          {hoverMessage}
        </Typography>
      )}
      {results && results.length > 0 ? (
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              <div>
                <strong>Profile ID:</strong> {result.profile_id}
              </div>
              <div>
                <strong>Name:</strong> {result.name}
              </div>
              <div>
                <strong>Profile For:</strong> {result.profile_for}
              </div>
              {result.hasOwnProperty('gotra') && (
                <div>
                  <strong>Gotra:</strong> {result.gotra}
                </div>
              )}
              <hr style={{ margin: '8px 0', borderTop: '1px solid #eee' }} />
            </li>
          ))}
        </ul>
      ) : (
        <Typography>No results found</Typography>
      )}
    </Paper>
  );
};

export default SearchResults;