import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary'>
      {'Copyright © '}
      <Link color='inherit' href='http://localhost:3000'>
        Wellbeing Bridge
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function BottomBar() {
  return (
    <>
      <Box style={{ backgroundColor: '#C5EDE9', paddingTop: '60px' }}>
        <Box
          display='flex'
          style={{ backgroundColor: 'white', borderTop: '0.1px solid #bdbdbd' }}
          mb={5}
          flexDirection='column'
        >
          <Box mt={3} mb={3} align='center'>
            <Container maxWidth='md'>
              <Typography variant='body1' color='textSecondary'>
                If you have any problem, please contact us by sending email to{' '}
                <Link
                  style={{ cursor: 'pointer' }}
                  href={'mailto:wellbeingbridge@gmail.com'}
                >
                  wellbeingbridge@gmail.com
                </Link>
              </Typography>
              <Copyright />
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  );
}
