import React from 'react';
import { Alert } from '@nice-digital/nds-alert';
import { NavLink } from 'react-router-dom'
// import { Link } from 'react-router'

// style
import './ResetPasswordSuccess.scss';


export const ResetPasswordSuccess = () => {
  // setTimeout(() => (document.location = '/login'), 5000)
  return (
    <div>
      <h2>Thank you</h2>
      <Alert type="success">
        Your password has been changed.
      </Alert>
    </div>
  )
}

export default ResetPasswordSuccess
