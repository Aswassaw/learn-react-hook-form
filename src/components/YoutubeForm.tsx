import { Fragment, useEffect } from "react";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phones: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  birthDate: Date;
};

export default function YoutubeForm() {
  const form = useForm<FormValues>({
    // defaultValues: {
    //   username: "Bawaan",
    //   email: "bawaan@gmail.com",
    //   channel: "Bawaan Channel"
    // }
    defaultValues: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data = await res.json();

      return {
        username: "Username Bawaan",
        email: data.email,
        channel: "Channel Bawaan",
        social: {
          twitter: "Ini Twitter",
          facebook: "Ini Facebook",
        },
        phones: ["111", "333"],
        phNumbers: [{ number: "" }],
        age: 20,
        birthDate: new Date(),
      };
    },
    mode: "onTouched"
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    setValue,
    getValues,
    reset,
    trigger,
  } = form;
  const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState;
  console.log({ touchedFields });
  console.log({ dirtyFields });
  console.log({ isDirty });
  console.log({ isSubmitting });
  console.log({ isSubmitted });
  console.log({ isSubmitSuccessful });
  console.log({ submitCount });

  const {
    fields: phNumbersField,
    append: phNumbersAppend,
    remove: phNumbersRemove,
  } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted", data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors);
  };

  const handleGetValues = () => {
    console.log("Get values", getValues("username"));
  };
  const handleSetValues = () => {
    setValue("username", "INI DIISI MENGGUNAKAN SET VALUE", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const watchUsername = watch("username");
  // const watchAll = watch();
  // console.log(watchAll);

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });
    return () => subscription.unsubscribe();
  }, [watch])

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful])

  renderCount++;
  return (
    <Fragment>
      <div>
        <h1>Youtube Form {renderCount}</h1>
        <h2>Watched value: {watchUsername}</h2>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              {...register("username", {
                required: "Username required",
              })}
            />
            <p>{errors.username?.message}</p>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email not valid",
                },
                validate: {
                  notAdmin: (fieldValue) => {
                    return (
                      fieldValue !== "admin@example.com" ||
                      "Enter a different email address"
                    );
                  },
                  notBlackListed: (fieldValue) => {
                    return (
                      !fieldValue.endsWith("admin@baddomain.com") ||
                      "This domain is not supported"
                    );
                  },
                  emailAvailable: async (fieldValue) => {
                    const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                    const data = await response.json();

                    return data.length == 0 || "Email already exists"
                  }
                },
              })}
            />
            <p>{errors.email?.message}</p>
          </div>
          <div>
            <label htmlFor="channel">Channel</label>
            <input
              type="text"
              {...register("channel", {
                required: "Channel required",
              })}
            />
            <p>{errors.channel?.message}</p>
          </div>
          <div>
            <label htmlFor="twitter">Twitter</label>
            <input
              type="text"
              {...register("social.twitter", {
                required: "Twitter required",
                // disabled: true,
                disabled: !watch("channel"),
              })}
            />
            <p>{errors.social?.twitter?.message}</p>
          </div>
          <div>
            <label htmlFor="facebook">Facebook</label>
            <input
              type="text"
              {...register("social.facebook", {
                required: "Facebook required",
              })}
            />
            <p>{errors.social?.facebook?.message}</p>
          </div>
          <div>
            <label htmlFor="primary-phone">Primary Phone Number</label>
            <input
              type="text"
              {...register("phones.0", {
                required: "Primary Phone required",
              })}
            />
            <p>{errors.phones?.[0]?.message}</p>
          </div>
          <div>
            <label htmlFor="secondary-phone">Secondary Phone Number</label>
            <input
              type="text"
              {...register("phones.1", {
                required: "Secondary Phone required",
              })}
            />
            <p>{errors.phones?.[1]?.message}</p>
          </div>

          <div>
            <label>List of phone numbers</label>
            <div>
              {phNumbersField.map((field, index) => {
                return (
                  <div key={field.id}>
                    <input
                      type="text"
                      {...register(`phNumbers.${index}.number`)}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => phNumbersRemove(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => phNumbersAppend({ number: "" })}
              >
                Add Phone Number
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="age">Age</label>
            <input
              type="number"
              {...register("age", {
                valueAsNumber: true,
                required: "Age required",
              })}
            />
            <p>{errors.age?.message}</p>
          </div>
          <div>
            <label htmlFor="birthDate">Birth Date</label>
            <input
              type="date"
              {...register("birthDate", {
                valueAsDate: true,
                required: "Birth Date required",
              })}
            />
            <p>{errors.birthDate?.message}</p>
          </div>

          <button disabled={!isDirty || !isValid}>Submit</button>
          <button type="button" onClick={() => reset()}>Reset</button>
          <button type="button" onClick={() => trigger()}>Validate!</button>
          <button type="button" onClick={handleGetValues}>
            Get Values
          </button>
          <button type="button" onClick={handleSetValues}>
            Set Values
          </button>
        </form>
        <DevTool control={control} />
      </div>
    </Fragment>
  );
}
