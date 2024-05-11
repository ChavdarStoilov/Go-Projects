import { useState } from "react";
import { useForm, isNotEmpty, isEmail, hasLength } from "@mantine/form";
import { Stepper, Button, Group, TextInput } from "@mantine/core";
import { Loader } from "@mantine/core";
import * as api from "../../api/data";

export default function NewBeandCreations({ addData }) {
    const [active, setActive] = useState(0);
    const [formData, setFormData] = useState({});
    const [nextStepBtton, setNextStepButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showData, setShowData] = useState(false);
    const [errors, setErrors] = useState({});
    const validator = {
        brand: useForm({
            mode: "uncontrolled",
            initialValues: {
                name: "",
            },

            validate: {
                name: isNotEmpty("Name must not be empty!"),
            },
        }),

        owner: useForm({
            mode: "uncontrolled",
            initialValues: {
                firstName: "",
                lastName: "",
            },

            validate: {
                firstName: isNotEmpty("First Name must not be empty!"),
                lastName: isNotEmpty("Last Name must not be empty!"),
            },
        }),
        contancts: useForm({
            mode: "uncontrolled",
            initialValues: {
                address: "",
                mail: "",
            },

            validate: {
                address: isNotEmpty("Address must not be empty!"),
                mail: isEmail("Invalid email"),
            },
        }),
    };
    const [loadingPOST, setLoadingPOST] = useState(false);

    const prevStep = () => {
        if (active === 3) {
            nextStepBtton.textContent = "Next step";
            nextStepBtton.offsetParent.style.backgroundColor = "#228be6";
        }
        setActive((current) => (current > 0 ? current - 1 : current));
    };

    const FormDetails = (e) => {

        console.log(e.target);
        const formValidator =
            e.target.parentElement.parentElement.parentElement
                .previousElementSibling.lastChild.children.length;


        if (formValidator) {
            const form =
                e.target.parentElement.parentElement.parentElement
                    .previousElementSibling.lastChild.children[1];

            if (form.tagName === "FORM") {
                var data;
                data = Object.fromEntries(new FormData(form));

                if (form.id == "owner") {
                    data = {
                        Owner: `${data["firstName"]} ${data["lastName"]}`,
                    };
                }

                if (!validator[form.id].validate(data).hasErrors) {
                    setFormData({
                        ...formData, // Copy the old fields
                        ...data, // But override this one
                    });
                    form.reset();
                    setActive((current) =>
                        current < 3 ? current + 1 : current
                    );
                }
                setErrors(validator[form.id].validate(data).errors);
            }

            if (
                active === 2 &&
                Object.keys(validator[form.id].validate(data).errors).length == 0
            ) {
                console.log(e.target);
                setNextStepButton(e.target);
                setLoading(true);
                e.target.offsetParent.disabled = true;

                setTimeout(() => {
                    setLoading(false);
                    e.target.textContent = "Save Data";
                    e.target.offsetParent.disabled = false;
                    e.target.offsetParent.style.backgroundColor = "green";

                    setShowData(true);
                }, 2000);
            } else if (active === 3) {
                setLoadingPOST(true);
                api.CreateBrandData(formData)
                    .then((result) => {
                        if (result.status === 200) {
                            addData();
                        }
                    })
                    .catch((e) => console.log(e))
                    .finally(() => {
                        setLoadingPOST(false);
                    });
            }
        }
    };

    return (
        <>
            <Stepper
                active={active}
                onStepClick={setActive}
                style={{ margin: "50px" }}
            >
                <Stepper.Step
                    label="First step"
                    description="Brand Details!"
                    style={{ color: "white" }}
                    allowStepSelect={false}
                >
                    <legend>Brand information</legend>
                    <form style={{ margin: "20px 150px" }} id="brand">
                        <TextInput
                            label="Enter name of brand:"
                            style={{ color: "white" }}
                            name="name"
                            required
                            key={validator["brand"].key("name")}
                            {...validator["brand"].getInputProps("name")}
                            error={errors["name"] ? errors["name"] : false}
                        />
                    </form>
                </Stepper.Step>
                <Stepper.Step
                    allowStepSelect={false}
                    label="Second step"
                    description="Owner details!"
                    style={{ color: "white" }}
                >
                    <legend>Owner information</legend>
                    <form style={{ margin: "20px 150px" }} id="owner">
                        <TextInput
                            label="Enter first name of owner:"
                            style={{ color: "white" }}
                            name="firstName"
                            required
                            error={
                                errors["firstName"]
                                    ? errors["firstName"]
                                    : false
                            }
                            key={validator["owner"].key("firstName")}
                            {...validator["owner"].getInputProps("firstName")}
                        />
                        <TextInput
                            label="Enter secont name of owner:"
                            style={{ color: "white" }}
                            name="lastName"
                            required
                            error={
                                errors["lastName"] ? errors["lastName"] : false
                            }
                            key={validator["owner"].key("lastName")}
                            {...validator["owner"].getInputProps("lastName")}
                        />
                    </form>
                </Stepper.Step>
                <Stepper.Step
                    label="Final step"
                    description="Contact details!"
                    style={{ color: "white" }}
                    loading={loading}
                    allowStepSelect={false}
                >
                    <legend>Address information</legend>

                    <form style={{ margin: "20px 150px" }} id="contancts">
                        <TextInput
                            label="Enter Address:"
                            style={{ color: "white" }}
                            name="address"
                            required
                            error={
                                errors["address"] ? errors["address"] : false
                            }
                            key={validator["contancts"].key("address")}
                            {...validator["contancts"].getInputProps("address")}
                        />
                        <TextInput
                            label="Enter Mail:"
                            style={{ color: "white" }}
                            name="mail"
                            required
                            type="email"
                            error={errors["mail"] ? errors["mail"] : false}
                            key={validator["contancts"].key("mail")}
                            {...validator["contancts"].getInputProps("mail")}
                        />
                    </form>
                </Stepper.Step>
                <Stepper.Completed>
                    <legend>Summary information</legend>

                    {showData ? (
                        <div
                            style={{
                                color: "white",
                                width: "180px",
                                margin: "50px auto",
                                textAlign: "left",
                            }}
                        >
                            <p>Brand: {formData.name}</p>
                            <p>Owner names: {formData.Owner}</p>
                            <p>Brand Address: {formData.address}</p>
                            <p>Mail: {formData.mail}</p>
                        </div>
                    ) : (
                        <Loader size={30} />
                    )}
                </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl">
                <Button variant="default" onClick={prevStep}>
                    Back
                </Button>
                <Button
                    onClick={FormDetails}
                    loading={loadingPOST}
                    loaderProps={{ type: "dots" }}
                >
                    Next step
                </Button>
            </Group>
        </>
    );
}
