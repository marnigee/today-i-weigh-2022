import React, { useEffect } from 'react';
import { netlifyIdentity } from 'netlify-identity-widget';
import Button from '@mui/material/Button';

export default function Identity() {
  useEffect(() => {
    // netlifyIdentity.init({});
  })
  return (
    <Button
      onClick={() => {
        netlifyIdentity.open();
      }}
    />
  )
}