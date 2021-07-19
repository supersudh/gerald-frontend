import React from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import './App.css';

import TextField from '@material-ui/core/TextField';
import Validator from './helpers/Validator';


interface iProps {

}

interface iState {
  phone: string;
  otp: string;
  hasRequestedOTP: boolean;
  errorMessage: string;
  hasValidatedOTP: boolean;
  loading: boolean;
}

const phoneGex = /\d{10}/;
const otpGex = /\d{6}/;
export default class App extends React.Component<iProps, iState> {
  constructor(props: iProps) {
    super(props);
    this.state = {
      phone: '',
      otp: '',
      hasRequestedOTP: false,
      errorMessage: '',
      hasValidatedOTP: false,
      loading: false,
    };
  }

  onChangePhone = (evt: any) => {
    const phone = evt.target.value;
    this.setState({ errorMessage: '', phone });
  };

  onChangeOTP = (evt: any) => {
    const otp = evt.target.value;
    this.setState({ errorMessage: '', otp });
  }

  handleRequestOTP = async () => {
    const { phone } = this.state;
    if (phoneGex.test(phone)) {
      const success = await Validator.requestOTP(phone);
      if (success) {
        this.setState({ hasRequestedOTP: true });
      } else {
        this.setState({ errorMessage: 'There was an error. Please try again...' })
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } else {
      this.setState({ errorMessage: 'Enter a valid 10-digit mobile number' });
    }
  };

  handleValidateOTP = async () => {
    const { phone, otp } = this.state;
    if (otpGex.test(otp)) {
      const success = await Validator.validateOTP(phone, otp);
      console.log(success);
      if (success) {
        this.setState({ hasValidatedOTP: true });
      } else {
        this.setState({ errorMessage: 'There was an error. Please try again...' })
      }
    } else {
      this.setState({ errorMessage: 'Invalid OTP' });
    }
  };

  renderMainTitle = (): JSX.Element => {
    const { hasRequestedOTP, errorMessage, hasValidatedOTP, loading } = this.state;
    if (loading) {
      return <h3 className="green">Loading...</h3>;
    } else if (errorMessage) {
      return <h3 className="red">{errorMessage}</h3>;
    } else if (hasValidatedOTP) {
      return <h3 className="green">OTP Verified successfully!</h3>;
    } else if (hasRequestedOTP) {
      return <h3>OTP sent to the entered number</h3>;
    } else {
      return <h3 className="green">Please enter your mobile to receive OTP</h3>;
    }
  }

  renderMobileForm(): JSX.Element {
    return (
      <div className="otp-form">
        <TextField
          label="Enter Mobile Number"
          variant="outlined"
          value={this.state.phone}
          onChange={this.onChangePhone}
          disabled={this.state.loading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleRequestOTP}
          className="request-otp-btn"
          disabled={this.state.loading}
        >
          Request OTP
        </Button>
      </div>
    );
  }

  renderMobileAndOTPForm(): JSX.Element {
    return (
      <div className="otp-form">
        <TextField
          label="Enter Mobile Number"
          variant="outlined"
          value={this.state.phone}
          disabled
        />
        <TextField
          label="Enter OTP"
          variant="outlined"
          value={this.state.otp}
          onChange={this.onChangeOTP}
          disabled={this.state.hasValidatedOTP}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleValidateOTP}
          className="validate-otp-btn"
          disabled={this.state.loading || this.state.hasValidatedOTP}
        >
          Validate OTP
        </Button>
      </div>
    );
  }

  renderForm(): JSX.Element {
    if (this.state.hasRequestedOTP) {
      return this.renderMobileAndOTPForm();
    } else {
      return this.renderMobileForm();
    }
  }

  render(): JSX.Element {
    return (
      <Container maxWidth="xl">

        <div className="otp-form-container">
          {this.renderMainTitle()}
          <div className="otp-form__outer">
            {this.renderForm()}
          </div>
        </div>
      </Container>
    );
  }
}
