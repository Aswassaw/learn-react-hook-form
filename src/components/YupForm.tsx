import { Fragment, useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

type FormValues = {
  username: string;
  email: string;
};

const schema = yup.object({
  username: yup.string().required("USERNAME REQUIRED"),
  email: yup.string().email("EMAIL GAK VALID").required("EMAIL REQUIRED"),
});

export default function YupForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
    },
    mode: "onTouched",
    resolver: yupResolver(schema),
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    reset,
    setError,
  } = form;
  const { errors, isDirty, isValid, isSubmitSuccessful } = formState;

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted", data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form Errors", errors);
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful])

  return (
    <Fragment>
      <div>
        <h1>Yup Form</h1>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              {...register("username")}
            />
            <p>{errors.username?.message}</p>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              {...register("email", {
                validate: {
                  notAdmin: (fieldValue) => {
                    return (
                      fieldValue !== "admin@example.com" ||
                      "Enter a different email address"
                    );
                  },
                },
              })}
            />
            <p>{errors.email?.message}</p>
          </div>
          <button disabled={!isDirty || !isValid}>Submit</button>
          <button type="button" onClick={() => setError("username", {
            message: "ERROR MANUAL",
            type: "manual"
          })}>BUAT ERROR</button>
          <button type="button" onClick={() => reset()}>Reset</button>
        </form>
        <DevTool control={control} />
      </div>
    </Fragment>
  );
}
