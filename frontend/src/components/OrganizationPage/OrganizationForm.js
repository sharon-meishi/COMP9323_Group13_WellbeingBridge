import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { storage } from '../firebase';
import placeholder from '../../Assets/placeholder.png';
import LoadingBackdrop from '../LoadingBackdrop';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

function FetchAlert(props) {
    return <Alert elevation={6} variant='filled' {...props} />;
  }

function OrganizationForm() {
    return (
        <div>
            OrganizationForm
        </div>
    )
}

export default OrganizationForm
