export const handleInputsChange = (event, inputs, setter) => {
  const { value, name } = event.target;

  setter({
    ...inputs,
    [name]: value,
  });
};
