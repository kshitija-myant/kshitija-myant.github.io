import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';
import { AWS } from '../../Services/AuthService';
import '../ScanPodId/QRCode.scss';
import QrScanner from 'qr-scanner';
import { useNavigate } from 'react-router-dom';

const QrContainer = () => {
    const [permissioDenied, setpermissionDenied] = useState(false);
    const [clinicName, setClinicName] = useState('');
    const [output, setOutput] = useState('No QR code found');
    const navigate = useNavigate();
    const QRRef = useRef();
    const QRRecorded = useRef();

    useEffect(() => {
        if(QRRef.current && !QRRecorded.current) {
            QRRecorded.current = new QrScanner(
                QRRef.current,
                result => {
                    if(result) {
                        console.log("Scanned Result from QR Scanner: ",result)
                        let output = ''
                        if(typeof result === 'string') 
                            output = result;
                        else if(typeof result === 'number') 
                            output = result.toString();
                        else 
                            output = result.data;
                        if(output.length === 12 && /^[0-9]+$/.test(output)) {
                            console.log("QR Code Scanned Successfully ", output)
                            setTimeout(() => {
                                localStorage.setItem("podId", output);
                                QRRecorded.current.stop();
                                QRRecorded.current = null;
                                navigate("/pod-info")
                            }, 1000);                             
                        } else {
                            console.log("QR Code Scanned with error ", output)
                            setOutput(output + ' - invalid pod ID');
                        }
                        
                    }
                },
            );
            QRRecorded.current.start();
        }
    }, [QRRef.current]);

    useEffect(() => {  

        return () => {
            if(QRRecorded.current) {
                QRRecorded.current.stop();
                QRRecorded.current = null;
            } 
        }
    }, []);

    useEffect(() => {
        const name = localStorage.getItem("clinicName")
        setClinicName(name)
    },[]);

    const aws = AWS.getInstance();

    useEffect(() => {

        navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .catch(err => {
            console.error("error:", err);
            setpermissionDenied(true);
          });
          },[]
        );


   const goBack = () =>{
    navigate("/scan-pod-id")
    return;
    }

 

return (
    <>
        {!permissioDenied ? 
        <div>
            <video ref={QRRef} style={{height: 300, width: window.width > 550 ? 550 : window.width}}></video>
            <p>{output}</p>
        </div>
        :
        <div className="app flex-row align-items-center">
            <Container className='form-container'>
                <Row >
                    <Col md="5" className='container-width'>
                    <div style={{display: 'flex', marginTop: "50px"}}>
                    <div className='clinic-name-div'><p className='clinic-name'> {clinicName} </p></div>
                    <div><Button className='logput-btn' onClick={() => {aws.logout()}}>Log out</Button></div>
                    </div>
                        <CardGroup>
                            <Card className='card-container'>
                                <CardBody className='card-body'>
                                    <div>
                                        <div>
                                        <p className='error-text-heading'>Allow camera permission to scan QR Code.</p>
                                        <p className='error-text'>In order to scan the QR Code, please allow camera permission for Google Chrome on your device. Once you have allowed permission, please go back and try again.</p>
                                        <p className='error-text'>You may also go back and use option 2 to enter the Pod ID manually.</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={goBack}
                                            type="button"
                                            color="primary"
                                            className="px-4 back-text-btn"
                                        >
                                            Go Back
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </CardGroup>
                    </Col>
                </Row>
            </Container>
        </div>
        }
    </>
)

};
export default QrContainer;