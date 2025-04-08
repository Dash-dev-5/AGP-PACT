import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchPapAsync, createPapFileAsync } from 'features/pap/papSlice';
import { ImportPapFormData } from 'features/pap/papTypes';
import { importPapSchema } from 'features/pap/papSchema';
import { useNavigate } from 'react-router-dom';
import { AiOutlineFolderView } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import DeletePap from './DeletePap';

function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: any[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedFunction;
}

export default function GestionPap() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { papList, status, error } = useAppSelector((state) => state.pap);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<ImportPapFormData>({
    resolver: zodResolver(importPapSchema)
  });

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState('');

  const handleDebouncedSearch = useDebounce((term: string) => {
    setFilter(term);
    setCurrentPage(0);
  }, 500);

  useEffect(() => {
    dispatch(fetchPapAsync({ filter, pageSize, pageNo: currentPage }));
  }, [dispatch, filter, currentPage, pageSize]);

  const onSubmit = async (data: ImportPapFormData) => {
    try {
      await dispatch(createPapFileAsync(data)).unwrap();
      toast.success('Fichier envoyé avec succès! Les données sont en cours de génération.');
      reset();
    } catch (err) {
      toast.error("Erreur lors de l'envoi du fichier.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('excel', file, { shouldValidate: true });
    }
  };

  const totalPages = Math.ceil(papList.length / pageSize);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestion PAP</h2>
        <div className="d-flex gap-3 align-items-center">
          <Form onSubmit={handleSubmit(onSubmit)} className="d-flex gap-2">
            <Form.Control
              type="file"
              accept=".xls, .xlsx"
              onChange={handleFileChange}
              className={`form-control ${errors.excel ? 'is-invalid' : ''}`}
            />
            <Button type="submit" variant="primary">
              Envoyer
            </Button>
          </Form>
          <Button variant="success" onClick={() => navigate('new')}>
            Créer
          </Button>
        </div>
      </header>

      <Form.Control type="text" placeholder="Rechercher..." className="mb-3" onChange={(e) => handleDebouncedSearch(e.target.value)} />

      <Table striped bordered hover responsive className="mb-4">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Code PAP</th>
            <th>Nom complet</th>
            <th>Sexe</th>
            <th>Âge</th>
            <th>Téléphone</th>
            <th>Pièce d'identité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {status === 'loading' && (
            <tr>
              <td colSpan={8} className="text-center">
                <Spinner animation="border" size="sm" />
              </td>
            </tr>
          )}
          {status === 'failed' && (
            <tr>
              <td colSpan={8} className="text-center text-danger">
                {error}
              </td>
            </tr>
          )}
          {status === 'succeeded' &&
            papList.length > 0 &&
            papList.map((pap, index) => (
              <tr key={pap.id}>
                <td>{currentPage * pageSize + index + 1}</td>
                <td>{pap.code}</td>
                <td>{pap.fullName}</td>
                <td>{pap.gender}</td>
                <td>{pap.age}</td>
                <td>{pap.phone}</td>
                <td>{pap.identityDocumentNumber}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button variant="info" size="sm" onClick={() => navigate(`${pap.id}`)}>
                      <AiOutlineFolderView />
                    </Button>
                    <Button variant="warning" size="sm" onClick={() => navigate(`update/${pap.id}`)}>
                      <FaRegEdit />
                    </Button>
                    <DeletePap id={pap.id} code={pap.code} />
                  </div>
                </td>
              </tr>
            ))}
          {status === 'succeeded' && papList.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center">
                Aucun PAP trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {papList.length > 0 && (
        <Pagination className="justify-content-end">
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item key={index} active={index === currentPage} onClick={() => handlePageChange(index)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
}
