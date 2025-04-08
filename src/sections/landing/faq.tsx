import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { fetchQuestions } from 'features/faq/questionsSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';

const Faq = () => {
  const { loading, questions } = useAppSelector((state) => state.faq);
  const dispatch = useAppDispatch();
  //Fetch all questions and answer
  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  return (
    <section className="container py-5 d-flex justify-content-center" id="faq">
      <div className="w-100" style={{ maxWidth: '800px' }}>
        <h2 className="text-center mb-4" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Foire aux questions (FAQ)
        </h2>
        <Accordion defaultActiveKey="0">
          {questions.map((faq, index) => (
            <Accordion.Item eventKey={index.toString()} key={index} className="mb-1 border-0">
              <Accordion.Header className="bg-light" style={{ cursor: 'pointer', borderBottom: '1px solid red', fontSize: '12' }}>
                <span className="mb-0">{faq.name}</span>
              </Accordion.Header>
              <Accordion.Body className="fs-6">
                {Array.isArray(faq.responses) && faq.responses.map((r, index) => <p key={index}>{r.name}</p>)}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;

interface FaqType {
  id: number;
  question: string;
  answer: string | JSX.Element;
}

const faqData: Array<FaqType> = [
  {
    id: 1,
    question: "Qu'est-ce que l'AGP-PACT ?",
    answer:
      "L'AGP-PACT est une application informatique mise en place pour faciliter la gestion des plaintes liées au projet d'Appui à la Connectivité et au Transport (PACT) en République Démocratique du Congo. Elle vise à centraliser et à améliorer le suivi des plaintes, qu'elles soient générales ou sensibles, tout en assurant la transparence et la réactivité du système de traitement des plaintes."
  },
  {
    id: 2,
    question: 'Comment puis-je soumettre une plainte ?',
    answer: (
      <>
        Vous pouvez soumettre une plainte via plusieurs canaux :
        <ul>
          <li>Remplir un formulaire électronique sur l'application mobile ou le portail web de l'AGP-PACT.</li>
          <li>Envoyer un SMS ou utiliser le service vocal préenregistré (IVR) à un numéro vert.</li>
          <li>Contacter directement un représentant de l'ONG ou du comité de gestion des plaintes.</li>
        </ul>
      </>
    )
  },
  {
    id: 3,
    question: "Quelle information dois-je fournir lors de l'enregistrement d'une plainte ?",
    answer: (
      <>
        Lors de l'enregistrement d'une plainte, il est important de fournir les informations suivantes :
        <ul>
          <li>Identité du plaignant (nom, contact, etc.)</li>
          <li>Détails sur l'incident (type de plainte, localisation, date, etc.)</li>
          <li>Description précise de la situation ou du préjudice subi.</li>
        </ul>
      </>
    )
  },
  {
    id: 4,
    question: "Comment puis-je suivre l'évolution de ma plainte ?",
    answer:
      "Après avoir soumis votre plainte, vous recevrez un code d'identification unique. Vous pourrez utiliser ce code pour suivre l'évolution de votre plainte via le portail web de l'AGP-PACT ou en envoyant un SMS."
  },
  {
    id: 5,
    question: 'Quelles sont les garanties de confidentialité pour les plaintes sensibles ?',
    answer:
      "Les plaintes sensibles, telles que celles liées aux Violences Basées sur le Genre (VBG) ou d'autres abus, seront traitées de manière confidentielle. Les informations concernant ces plaintes ne seront accessibles qu'aux personnes autorisées, garantissant ainsi la protection des plaignants."
  },
  {
    id: 6,
    question: 'Quels délais sont prévus pour le traitement des plaintes ?',
    answer: (
      <>
        Les délais de traitement des plaintes dépendent de leur niveau de priorité :
        <ul>
          <li>Urgent : traitement immédiat.</li>
          <li>Prioritaire : traitement dans les 24 heures.</li>
          <li>
            Normal : traitement dans les 48 heures. Des notifications de rappel seront envoyées aux responsables de traitement si les délais
            sont dépassés.
          </li>
        </ul>
      </>
    )
  },
  {
    id: 7,
    question: "Qui peut utiliser l'AGP-PACT ?",
    answer:
      "L'AGP-PACT est accessible à tous les citoyens, acteurs communautaires, et parties prenantes concernées par le projet PACT. Les utilisateurs peuvent enregistrer des plaintes, suivre leur traitement et recevoir des mises à jour."
  },
  {
    id: 8,
    question: "Quelle est la durée de garantie et de maintenance de l'application ?",
    answer:
      "Le consultant en charge de l'AGP-PACT assurera une garantie de bon fonctionnement pendant 12 mois après la livraison définitive de l'application, incluant la maintenance corrective et préventive. Des conditions de maintenance évolutive seront également précisées au-delà de cette période."
  },
  {
    id: 9,
    question: "Comment puis-je obtenir de l'aide si j'ai des difficultés avec l'application ?",
    answer:
      "Pour toute assistance concernant l'utilisation de l'AGP-PACT, vous pouvez contacter notre service d'assistance téléphonique dont les coordonnées sont disponibles sur le site web de l'application."
  }
];
