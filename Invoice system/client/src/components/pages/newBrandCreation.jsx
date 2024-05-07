import { act, useState } from "react";
import { Stepper, Button, Group, Box, TextInput } from "@mantine/core";

export default function NewBeandCreations() {
    const [active, setActive] = useState(0);
    const [formData, setFormData] = useState({});
    const [nextStepBtton, setNextStepButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showData, setShowData] = useState(false);

    const nextStep = (e) => {
        setActive((current) => (current < 3 ? current + 1 : current));
        FormDetails(e);

        if (active === 2) {
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
            console.log(formData);
        }
    };
    const prevStep = () => {
        if (active === 3) {
            nextStepBtton.textContent = "Next step";
            nextStepBtton.offsetParent.style.backgroundColor = "#228be6";
        }
        setActive((current) => (current > 0 ? current - 1 : current));
    };

    const FormDetails = (e) => {
        const formValidator =
            e.target.parentElement.parentElement.parentElement
                .previousElementSibling.lastChild.children.length;

        if (formValidator) {
            const form =
                e.target.parentElement.parentElement.parentElement
                    .previousElementSibling.lastChild.children[0];

            if (form.tagName === "FORM") {
                if (form.checkValidity() === true) {
                    const data = Object.fromEntries(new FormData(form));

                    setFormData({
                        ...formData, // Copy the old fields
                        ...data, // But override this one
                    });
                    form.reset();
                }
                else {
                    e.target.offsetParent.disabled = false;
                }
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
                    <form style={{ margin: "20px 150px" }}>
                        <TextInput
                            label="Enter name of brand:"
                            style={{ color: "white" }}
                            name="name"
                            required
                        />
                    </form>
                </Stepper.Step>
                <Stepper.Step
                    allowStepSelect={false}
                    label="Second step"
                    description="Owner details!"
                    style={{ color: "white" }}
                >
                    <form style={{ margin: "20px 150px" }}>
                        <TextInput
                            label="Enter first name of owner:"
                            style={{ color: "white" }}
                            name="firstName"
                            required
                        />
                        <TextInput
                            label="Enter secont name of owner:"
                            style={{ color: "white" }}
                            name="lastName"
                            required
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
                    <form style={{ margin: "20px 150px" }}>
                        <TextInput
                            label="Enter Address:"
                            style={{ color: "white" }}
                            name="address"
                            required
                        />
                        <TextInput
                            label="Enter Mail:"
                            style={{ color: "white" }}
                            name="mail"
                            required
                            type="email"
                        />
                    </form>
                </Stepper.Step>
                <Stepper.Completed>
                    {showData && (
                        <div
                            style={{
                                color: "white",
                                width: "180px",
                                margin: "50px auto",
                                textAlign: "left",
                            }}
                        >
                            <p>Brand: {formData.name}</p>
                            <p>
                                Owner names: {formData.firstName}{" "}
                                {formData.lastName}
                            </p>
                            <p>Brand Address: {formData.address}</p>
                            <p>Mail: {formData.mail}</p>
                        </div>
                    )}
                </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl">
                <Button variant="default" onClick={prevStep}>
                    Back
                </Button>
                <Button onClick={nextStep}>Next step</Button>
            </Group>
        </>
    );
}
