"use client";

import React, { useState, useEffect } from "react";

import InputComponent from "./InputComponent";
import { Calendar } from "primereact/calendar";
import { format } from "date-fns"; // For formatting dates (optional)
import { useRouter } from "next/navigation";
import { useToast } from '@/context/ToastContext';
import OTPDialog from './OTPDialog';


function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [changedField, setChangedField] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState<{
    type: 'registration' | 'email' | null;
    message: string;
  } | null>(null);
  const [signedUp, setSignedUp] = useState(false);
  const [currCertificateId, setCurrCertificateId] = useState(1);
  const [currExperienceId, setCurrExperienceId] = useState(1);
  const [currInterestId, setCurrInterestId] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    country: "",
    city: "",
    speciality: "",
  });



  const [errorMessage, setErrorMessage] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    speciality: "",
    country: "",
    city: "",
  });

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    validateForm();
  }, [formData]);

  const formFields = [
    { name: "firstName", title: "First Name", type: "text" },
    { name: "lastName", title: "Last Name", type: "text" },
    { name: "email", title: "Email", type: "email" },
    { name: "phone", title: "Phone Number", type: "number" },
    { name: "password", title: "Password", type: "password" },
    { name: "confirmPassword", title: "Confirm Password", type: "password" },
  ];

  const submitButtonClass = [
    "bg-sky-500 text-neutral-50 text-lg	p-3.5	w-full border-none rounded-lg cursor-pointer transition-[background-color]",
    "disabled:bg-neutral-300 disabled:text-neutral-700 disabled:cursor-not-allowed enabled:bg-sky-500",
  ].join(" ");

  const validateFieldsChosen = () => {
    const requiredFields = [
      'firstName', 
      'lastName', 
      'email', 
      'password', 
      'confirmPassword', 
      'phone', 
      'gender'
    ];


    const basicFieldsValid = requiredFields.every(field => 
      formData[field as keyof typeof formData]
    );

   
  
    return basicFieldsValid;
  };

  const validateFirstName = () => {
    let regex = /^[a-zA-Z]+$/;
    let changedValidation = false;

    if (formData.firstName && !regex.test(formData.firstName)) {
      if (errorMessage.firstName === "") {
        changedValidation = true;
      }
      setErrorMessage((prevError) => ({
        ...prevError,
        firstName: "First Name Must Consist Of Only Characters",
      }));
    } else {
      if (errorMessage.firstName !== "") {
        changedValidation = true;
      }
      setErrorMessage((prevError) => ({ ...prevError, firstName: "" }));
    }

    if (changedValidation && validateFieldsChosen()) {
      setFormData((prevForm) => ({ ...prevForm })); // Extra rerender needed to correct the current input error status
    }
  };

  const validateLastName = () => {
    let regex = /^[a-zA-Z]+$/;
    let changedValidation = false;
    if (formData.lastName && !regex.test(formData.lastName)) {
      if (errorMessage.lastName === "") {
        changedValidation = true;
      }
      setErrorMessage((prevError) => ({
        ...prevError,
        lastName: "Last Name Must Consist Of Only Characters",
      }));
    } else {
      if (errorMessage.lastName !== "") {
        changedValidation = true;
      }
      setErrorMessage((prevError) => ({ ...prevError, lastName: "" }));
    }

    if (changedValidation && validateFieldsChosen()) {
      setFormData((prevForm) => ({ ...prevForm }));
    }
  };

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let changedValidation = false;
    if (formData.email && !emailPattern.test(formData.email)) {
      if (errorMessage.email === "") {
        changedValidation = true;
      }
      setErrorMessage((prevError) => ({
        ...prevError,
        email: "Email Is Invalid",
      }));
    } else {
      if (errorMessage.email !== "") {
        changedValidation = true;
      }
      setErrorMessage((prevError) => ({ ...prevError, email: "" }));
    }

    if (changedValidation && validateFieldsChosen()) {
      setFormData((prevForm) => ({ ...prevForm }));
    }
  };

  const validatePassword = () => {
    // Individual validation patterns
    const patterns = {
      minLength: /.{8,}/,            // At least 8 characters
      hasUpperCase: /[A-Z]/,         // At least one uppercase letter
      hasLowerCase: /[a-z]/,         // At least one lowercase letter
      hasNumber: /\d/,               // At least one number
      hasSymbol: /[@$!%*#?&]/        // At least one special character
    };

    let changedValidation = false;
    const password = formData.password;

    if (!password) {
      // Empty password field
      if (errorMessage.password !== "") {
        changedValidation = true;
        setErrorMessage(prevError => ({ ...prevError, password: "" }));
      }
      return;
    }

    // Check all password requirements
    const validations = {
      length: patterns.minLength.test(password),
      upper: patterns.hasUpperCase.test(password),
      lower: patterns.hasLowerCase.test(password),
      number: patterns.hasNumber.test(password),
      symbol: patterns.hasSymbol.test(password)
    };

    // Generate specific error message based on failed validations
    const errorMessages = [];
    if (!validations.length) errorMessages.push("at least 8 characters");
    if (!validations.upper) errorMessages.push("one uppercase letter");
    if (!validations.lower) errorMessages.push("one lowercase letter");
    if (!validations.number) errorMessages.push("one number");
    if (!validations.symbol) errorMessages.push("one special character (@$!%*#?&)");

    const isValid = Object.values(validations).every(v => v);

    if (isValid) {
      if (errorMessage.password !== "") {
        changedValidation = true;
        setErrorMessage(prevError => ({ ...prevError, password: "" }));
      }
    } else {
      if (errorMessage.password === "") {
        changedValidation = true;
      }
      const errorMsg = `Password must contain ${errorMessages.join(", ")}`;
      setErrorMessage(prevError => ({
        ...prevError,
        password: errorMsg
      }));
    }

    if (changedValidation && validateFieldsChosen()) {
      setFormData(prevForm => ({ ...prevForm }));
    }
  };

  const validateConfirmPassword = () => {
    let changedValidation = false;

    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      if (errorMessage.confirmPassword === "") {
        changedValidation = true;
      }
      setErrorMessage((prevError) => ({
        ...prevError,
        confirmPassword: "Passwords Don't Match",
      }));
    } else {
      if (errorMessage.confirmPassword !== "") {
        changedValidation = true;
      }
      setErrorMessage((prevError) => ({ ...prevError, confirmPassword: "" }));
    }

    if (changedValidation && validateFieldsChosen()) {
      setFormData((prevForm) => ({ ...prevForm }));
    }
  };

  const validatePhone = () => {
    const phonePattern = /^-?\d+$/;
    let changedValidation = true;
    if (changedValidation && validateFieldsChosen()) {
      setFormData((prevForm) => ({ ...prevForm }));
    }
  };



  const validateForm = () => {
  validateFirstName();
  validateLastName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();
  validatePhone();

  // Check if all fields are filled and valid
  const fieldsChosen = validateFieldsChosen();
  const noErrors = Object.values(errorMessage).every(error => error === '');

    setFormValid(fieldsChosen && noErrors);
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setChangedField(() => name);
  };







 



  const handleEmailVerification = async () => {
    try {
      setShowOTPDialog(false);
      setIsEmailVerified(true);
      // Continue with the registration process
        await handleRegistration();
    } catch (error) {
      showError('Verification failed');
      console.error("Error during verification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_NAME}register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fName: formData.firstName,
            lName: formData.lastName,
            email: formData.email,
            password: formData.password,
            gender: formData.gender,
            phone: formData.phone,
          }),
          mode: "cors",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.message?.includes('Email already exists')) {
          setError({ type: 'email', message: 'This email is already registered!' });
        } else {
          setError({ type: 'registration', message: 'Failed to register. Please try again.' });
        }``
        throw new Error("Failed to register");
      }

      setError(null);
      setSignedUp(true);
      showSuccess('Registered Successfully');
    } catch (error) {
      setSignedUp(false);
      showError('Registration Failed');
      console.error("Error During Signup:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!formValid) return;

    // Show OTP dialog instead of immediate registration
    setShowOTPDialog(true);
  };






  const handleOTPDialogClose = () => {
    setShowOTPDialog(false);
    setLoading(false); // Reset loading state
  };
  const handleRegisterNewUser = () => {
    setSignedUp(false);
    window.location.reload(); // Refresh the page
  };
  if (signedUp) {
    return (
      <div className="p-5 rounded-xl max-w-md m-auto h-screen overflow-y-hidden hover:overflow-y-scroll">
        <p className="font-semibold text-green-700 mt-4 mb-2">
          Signed up successfully!
        </p>
     
        <button
          type="button"
          className={`${submitButtonClass} disabled:cursor-not-allowed disabled:opacity-50 mb-14`}
          onClick={handleRegisterNewUser}
        >
          Register new user
          </button>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl max-w-md m-auto h-screen overflow-y-hidden hover:overflow-y-scroll">
      <h2 className="font-bold text-2xl text-center text-neutral-700 mb-6">
        Sign Up
      </h2>
      
      <form onSubmit={handleSubmit}>
        {formFields.map((field) => {
          return (
            <React.Fragment key={field.name}>
              {field.name === "birthDate" ? (
                <>
                  <label className="block text-base mb-1.5 font-semibold text-neutral-700">
                    {field.title} *
                  </label>
                  </>
              ) : (
                <InputComponent
                  key={field.name}
                  label={field.title}
                  type={field.type}
                  name={field.name}
                  placeholder={
                    field.name === "phone" && !formData.phone
                      ? "+20 XXXX XXX XXX"
                      : `Enter ${field.title}`
                  }
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  errorText={
                    errorMessage[field.name as keyof typeof errorMessage]
                  }
                  required
                  additionalText={
                    field.name === "phone" && !errorMessage.phone
                      ? ""
                      : ""
                  }
                />
              )}
              </React.Fragment>
          );
        })}
        <div className="mb-4">
          <label className="block text-base mb-1.5 font-semibold text-neutral-700">
            Gender *
          </label>
          <div className="flex gap-8">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleChange}
                className="radio align-middle mb-[3px] mr-1"
                checked={formData.gender === "Male"}
                required
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleChange}
                className="radio align-middle mb-[3px] mr-1"
                checked={formData.gender === "Female"}
              />
              Female
            </label>
          </div>
        </div>
        
        {error && (
          <p className={`font-semibold mt-4 mb-2 ${error.type === 'email' ? 'text-yellow-600' : 'text-red-600'
            }`}>
            {error.message}
          </p>
        )}
        {signedUp && (
          <p className="font-semibold text-green-700 mt-4 mb-2">
            Signed up successfully!
          </p>
        )}
        <button
          type="submit"
          className={`${submitButtonClass} disabled:cursor-not-allowed disabled:opacity-50 mb-14`}
          disabled={false}
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      {/* Add OTP Dialog */}
      <OTPDialog
        visible={showOTPDialog}
        onHide={() => setShowOTPDialog(false)}
        onVerificationComplete={handleEmailVerification}
        loading={loading}
        userEmail={formData.email}
        onDialogClose={handleOTPDialogClose}
      />
    </div>
  );
}

export default SignUpForm;