import { useState } from "react";
import { Button, Row, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CreatePlainteNonSensible from "./modalplaintenonsensible";
import CreatePlainteGenerale from "./modalplaintegenerale";

function CreateChooseCreate({
    show,
    setShowChooseOptions,
}: {
    show: boolean;
    setShowChooseOptions: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const handleClose = () => setShowChooseOptions(false);
    const navigate = useNavigate();
    const [showGenerale, setShowPlainteGenerale] = useState(false);
    const [showPlainteNonSensible, setShowPlainteNonSensible] = useState(false);

    const handleContinuePlainteNonSensible = () => {
        setShowChooseOptions(false);
        setTimeout(() => {
            setShowPlainteNonSensible(true);
        }, 300);
    };

    const handleContinuePlainteGenerale = () => {
        setShowChooseOptions(false);
        setTimeout(() => {
            setShowPlainteGenerale(true);
        }, 300);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Création Plainte</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3 p-3 justify-content-center">
                        <Button variant="primary" className="w-75" onClick={()=> navigate('/plainte-generale')}>
                            Plainte Générale
                        </Button>
                        <Button variant="primary" className="w-75" onClick={handleContinuePlainteNonSensible}>
                            Plainte non-sensible
                        </Button>
                    </Row>
                </Modal.Body>
            </Modal>

            <CreatePlainteNonSensible 
                show={showPlainteNonSensible} 
                setShowPlainteNonSensible={setShowPlainteNonSensible} 
            />

            <CreatePlainteGenerale 
                show={showGenerale} 
                setShowPlainteGenerale={setShowPlainteGenerale} 
            />
        </>
    );
}

export default CreateChooseCreate;