import React, { useEffect, useMemo, useState } from 'react';
import { Form, Button, Modal, Table, ToastContainer, Toast, Spinner, Pagination, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CustomToast from 'components/customToast';
import { useNavigate } from 'react-router-dom';
import { GroupCommitees } from 'types/commitee';
import { createGroupCommitees, fetchGroupCommitees } from 'features/groupCommittes/groupCommiteesSlice';
import { Question, Response } from 'types/faq';
import { createQuestion, deleteQuestion, fetchQuestions } from 'features/faq/questionsSlice';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import DeleteQuestion from 'components/ui/question/DeleteQuestion';
import UpdateQuestion from 'components/ui/question/UpdateQuestion';
import useAuth from 'hooks/useAuth';

export default function Faq() {
  const { register, handleSubmit, reset } = useForm<Question>();
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPageState, setCurrentPageState] = useState<number>(0);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const { loading, questions } = useAppSelector((state) => state.faq);
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Response[]>([]);
  const dispatch = useAppDispatch();
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const { user } = useAuth();
  console.log(user?.token);

  //Fetch all questions and answer
  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  // Function to retrieve 'page' parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    if (page) {
      setCurrentPageState(Number(page));
    }
  }, [location.search]);

  //Submit data
  const onSubmit = async (data: Question) => {
    const currentQuestion = {
      name: data.name,
      responses: answers.filter((answer) => answer.name.trim() !== '') // Filtrer les réponses vides
    };

    try {
      await dispatch(createQuestion(currentQuestion)).unwrap();
      setShowToast(true);
      setToastMessage('Faq créé avec succès !');
      setToastType('success');
      reset();
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      setShowToast(true);
      setToastMessage(String(error));
      setToastType('error');
    }
  };

  // Filtered questions based on search term
  const filteredGroupCommittees = useMemo(() => {
    if (!searchTerm) return questions;
    return questions.filter((group) => group.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, questions]);

  //List of colors
  const colors = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#fd7e14'];

  //Managing questions/answer
  const handleAddAnswer = () => {
    setAnswers([...answers, { name: '' }]);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = { name: value };
    setAnswers(newAnswers);
  };

  return (
    <>
      {loading ? (
        <>
          <div className="d-flex justify-content-center">
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
          </div>
        </>
      ) : (
        <div className="row">
          <div className="mb-3">
            <span className="fs-4">Foire Aux Questions</span>
          </div>
          <div className="d-md-flex d-none flex-column flex-md-row gap-2 gap-md-0 justify-content-md-between mb-5">
            <Form.Control
              type="text"
              placeholder="Rechercher une question"
              aria-label="Rechercher"
              className="w-25"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-primary" className="me-2 w-25" onClick={handleShow}>
              Ajouter une question/réponse
            </Button>
          </div>
          <div className="d-md-none d-flex flex-column  gap-2 gap-md-0 justify-content-md-between mb-5">
            <Form.Control
              type="text"
              placeholder="Rechercher un groupe de comité"
              aria-label="Rechercher"
              className="w-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-primary" className="me-2 w-100" onClick={handleShow}>
              Ajouter une question/réponse
            </Button>
          </div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Question</th>
                <th>Réponse</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroupCommittees.map((m, index) => (
                <tr key={index}>
                  <td>{m.name}</td>
                  {Array.isArray(m.responses) && m.responses.map((answer, answerIndex) => <div key={answerIndex}>{answer.name}</div>)}
                  <td>
                    <div className="d-flex gap-2 align-items-center justify-content-center">
                      {m.id && m.name && <UpdateQuestion id={m.id} currentName={m.name} />}
                      {m.id && m.name && <DeleteQuestion id={m.id} name={m.name} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un question/réponse</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-2">
              <Form.Group controlId="name">
                <Form.Label>Question</Form.Label>
                <Form.Control {...register('name')} required />
              </Form.Group>
              {answers.map((answer, index) => (
                <Form.Group controlId={`answer-${index}`} key={index} className="mt-3">
                  <Form.Label>Réponse {index + 1}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={answer.name}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    required
                  />
                </Form.Group>
              ))}

              {/* Bouton pour ajouter une nouvelle réponse */}
              <Button variant="outline-primary" className="mt-3" onClick={handleAddAnswer}>
                Ajouter une autre réponse
              </Button>
            </div>
            <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Toast */}
      <CustomToast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}
