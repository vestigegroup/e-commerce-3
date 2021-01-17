import React, { useState } from 'react';
import Layout from '../components/Layout';
import getCommerce from '../utils/commerce'
import { Alert } from '@material-ui/lab';
import { Grid, Card, Slide, Select, Typography } from '@material-ui/core';
import Link  from 'next/link';
import { useStyles } from '../utils/styles';
import { useContext } from 'react';
import { Store } from '../components/Store';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import dynamic from 'next/dynamic';
import { CART_RETRIEVE_SUCCESS } from '../utils/constants';
import { Router } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { Stepper } from '@material-ui/core';
import { Step } from '@material-ui/core';
import { StepLabel } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';

const dev = process.env.NODE_ENV === 'development';

function Checkout(props) {
  const classes = useStyles();
  const { state, dispatch} = useContext(Store);
  const { cart } = state;

  //User Data
  const [firstName, setFirstName] = useState(dev ? 'John' : '');
  const [lastName, setLastName] = useState(dev ? 'Doe' : '');
  const [email, setEmail] = useState(dev ? 'johndoe@email.com' : '');

  //Shipping Data
  const [shippingName, setShippingName] = useState(dev ? 'John Doe' : '');
  const [shippingStreet, setShippingStreet] = useState(
    dev ? '123 Fake St' : ''
  );
  const [shippingCity, setShippingCity] = useState(dev ? 'New York City' : '');
  const [shippingStateProvince, setShippingStateProvince] = useState(
    dev ? 'NY' : ''
  );
  const [shippingPostalZipCode, setShippingPostalZipCode] = useState(
    dev ? '10001' : ''
  );
  const [shippingCountry, setShippingCountry] = useState(dev ? 'USA' : '');

  //Payment Data
  const [cardNum, setCardNum] = useState(dev ? '4242 4242 4242 4242' : '');
  const [expMonth, setExpMonth] = useState(dev ? '11' : '');
  const [expYear, setExpYear] = useState(dev ? '2023' : '');
  const [cvv, setCvv] = useState(dev ? '123' : '');
  const [billingPostalZipcode, setBillingPostalZipcode] = useState(
    dev ? '10001' : ''
  );

  //Step Process
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = [ 'Customer Information', 'Shipping Details', 'Payment Information'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if (activeStep === steps.length - 1) {
      //handleCaptureCheckout();
    }
  };

  const [errors, setErrors] = useState([]);

  const handleBack = () => {
    setErrors([]);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingCountryChange = (e) => {
    const currentValue = e.target.value;
    setShippingCountry(e.target.value);
    fetchSubdivisions(currentValue);
  };

  const fetchSubdivisions = async (countryCode) => {
    const commerce = getCommerce(props.commercePublicKey);
    const subdivisions = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setShippingSubdivisions(subdivisions.subdivisions);
  };

  const handleSubdivisionChange = (e) => {
    const currentValue = e.target.value;
    setShippingStateProvince(currentValue);
    fetchShippingOptions(checkoutToken.id, shippingCountry, currentValue);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    stateProvince = null
  ) => {
    const commerce = getCommerce(props.commercePublicKey);
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      {
        country: country,
        region: stateProvince,
      }
    );
    const shippingOption = options[0] ? options[0].id : null;
    setShippingOption(shippingOption);
    setShippingOptions(options);
    console.log(shippingOption);
  };


  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingName"
              label="Full Name"
              name="name"
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingStreet"
              label="Street"
              name="address"
              value={shippingStreet}
              onChange={(e) => setShippingStreet(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingCity"
              label="City"
              name="city"
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingPostalZipCode"
              label="Postal/Zip Code"
              name="postalCode"
              value={shippingPostalZipCode}
              onChange={(e) => setShippingPostalZipCode(e.target.value)}
            />
            <FormControl className={classes.formControl}>
              <InputLabel id="shippingCountry-label">Country</InputLabel>
              <Select
                labelId="shippingCountry-label"
                id="shippingCountry"
                label="Country"
                fullWidth
                onChange={handleShippingCountryChange}
                value={shippingCountry}
              >
                {Object.keys(shippingCountries).map((index) => (
                  <MenuItem value={index} key={index}>
                    {shippingCountries[index]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="shippingStateProvince-label">
                State / Province
              </InputLabel>

              <Select
                labelId="shippingStateProvince-label"
                id="shippingStateProvince"
                label="State/Province"
                fullWidth
                onChange={handleSubdivisionChange}
                value={shippingStateProvince}
                required
                className={classes.mt1}
              >
                {Object.keys(shippingSubdivisions).map((index) => (
                  <MenuItem value={index} key={index}>
                    {shippingSubdivisions[index]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="shippingOption-label">Shipping Option</InputLabel>

              <Select
                labelId="shippingOption-label"
                id="shippingOption"
                label="Shipping Option"
                fullWidth
                onChange={handleShippingOptionChange}
                value={shippingOption}
                required
                className={classes.mt1}
              >
                {shippingOptions.map((method, index) => (
                  <MenuItem
                    value={method.id}
                    key={index}
                  >{`${method.description} - $${method.price.formatted_with_code}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="cardNum"
              label="Card Number"
              name="cardNum"
              value={cardNum}
              onChange={(e) => setCardNum(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="expMonth"
              label="Expiry Month"
              name="expMonth"
              value={expMonth}
              onChange={(e) => setExpMonth(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="expYear"
              label="Expiry Year"
              name="expYear"
              value={expYear}
              onChange={(e) => setExpYear(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="cvv"
              label="CVV"
              name="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="billingPostalZipcode"
              label="Postal/Zip Code"
              name="postalCode"
              value={billingPostalZipcode}
              onChange={(e) => setBillingPostalZipcode(e.target.value)}
            />
          </>
        );
      default:
        return 'Unknown step';
    }
  }



  return (
    <Layout title = "Checkout" commercePublicKey ={props.commercePublicKey}>
        <Typography gutterBottom variant="h6" color="textPrimary" component="h1">
            Checkout
        </Typography>
        {cart.loading ? (
        <CircularProgress />
        ) : (
        <Grid container spacing={2}>
            <Grid item md={8}>
                <Card className={classes.p1}>
                <form>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box>
                        {activeStep === steps.length ? (
                        errors && errors.length > 0 ? (
                            <Box>
                                <List>
                                    {errors.map((error) => (
                                        <ListItem key={error}>
                                            <Alert severity="error">{error}</Alert>
                                        </ListItem>
                                    ))}
                                </List>
                                <Box className={classes.mt1}>
                                    <Button onClick={handleBack} className={classes.button}>
                                        Back
                                    </Button>
                                </Box>
                            </Box>
                            ) : (
                            <Box>
                                <CircularProgress />
                                <Typography className={classes.instructions}>
                                    Confirming Order...
                                </Typography>
                            </Box>
                            )
                            ) : (
                            <Box>
                                {getStepContent(activeStep)}
                                <Box className={classes.mt1}>
                                    <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.button}>
                                        Back
                                    </Button>
                                    <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}>
                                        {activeStep === steps.length - 1 ? 'Confirm Order' : 'Next'}
                                    </Button>
                                </Box>
                            </Box>
                            )}
                    </Box>
                </form>
                </Card>
            </Grid>
            


        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Checkout), { //NextJS function
    ssr: false, 
});
