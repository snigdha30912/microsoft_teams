import { fb } from 'service';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormField } from 'components/FormField/FormField';
import { defaultValues, validationSchema } from './formikConfig';

export const Signup = () => {
  const history = useHistory();
  const [serverError, setServerError] = useState('');

  const signup = ({ email, userName, password }, { setSubmitting }) => {
    fb.auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        if (res?.user?.uid) {
          fetch('/api/createUser', {
            method: 'POST',
            body: JSON.stringify({
              userName,
              userId: res.user.uid,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(() => {
            fb.firestore
              .collection('chatUsers')
              .doc(res.user.uid)
              .set({ userName, avatar: '' });
          });
        } else {
          setServerError(
            "We're having trouble signing you up. Please try again.",
          );
        }
      })
      .catch(err => {
        if (err.code === 'auth/email-already-in-use') {
          setServerError('An account with this email already exists');
        } else {
          setServerError(
            "We're having trouble signing you up. Please try again.",
          );
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="login-site">
      <div className="login-page">
    <div className="auth-form">
      <h1 style={{'color' : 'rgb(204, 29, 67)'}}>Signup</h1>
      <Formik
        onSubmit={signup}
        validateOnMount={true}
        initialValues={defaultValues}
        validationSchema={validationSchema}
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <FormField name="userName" label="User Name" />
            <FormField name="email" label="Email" type="email" />
            <FormField name="password" label="Password" type="password" />
            <FormField
              type="password"
              name="verifyPassword"
              label="Verify Password"
            />

            <div className="auth-link-container">
              Already have an account?{' '}
              <span className="auth-link" onClick={() => history.push('login')}>
                Log In!
              </span>
            </div>

            <button disabled={isSubmitting || !isValid} type="submit" style={{'background-color':'#dea5a4', 'color' : 'rgb(204, 29, 67)'}}>
              Sign Up
            </button>
          </Form>
        )}
      </Formik>

      {!!serverError && <div className="error">{serverError}</div>}
      </div>
    </div>
    <div className="login-page">
    <img
              src="/img/chat5.webp"
              className="picture-right"
              alt="point-left"
            />
            </div>
  
    </div>
  );
};
