import React, { useState } from 'react';
import PropTypes from 'prop-types';

import api from '../../api';
import classes from './index.module.css';
import MultiChoiceProblem from './MultiChoiceProblem';

const PracticePage = ({
  type, question, data, hints,
}) => {
  const [submissionData, setSubmissionData] = useState({});
  const [result, setResult] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  const submit = async () => {
    try {
      setSubmitting(true);
      const submission = await api.createPageSubmission(submissionData);
      setResult(submission);
    } catch (e) {
      console.log('woops');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmissionChange = (d) => {
    setSubmissionData(d);
  };

  let problemJsx;
  switch (type) {
    case 'multichoice':
      problemJsx = (
        <MultiChoiceProblem
          onSubmissionDataChange={onSubmissionChange}
          options={data.options}
        />
      );
      break;
    default:
      throw new Error('no component type for problem type');
  }

  return (
    <div className={classes.ProblemPage}>
      {hintVisible && (<div>{JSON.stringify(hints)}</div>)}
      {submitting && (<div>Im submitting</div>)}
      {result && (<div>{JSON.stringify(result)}</div>)}
      <div className={classes.LeftContent}>
        {problemJsx}
      </div>
      <div className={classes.RightContent}>
        <div className={classes.PromptBox}>
          <div className="arrow">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 55C43.8071 55 55 43.8071 55 30C55 16.1929 43.8071 5 30 5C16.1929 5 5 16.1929 5 30C5 43.8071 16.1929 55 30 55Z" stroke="white" strokeWidth="5" />
              <path d="M25 21.21C26.25 18.735 27.5 17.5 30 17.5C33.115 17.5 35 19.9725 35 22.445C35 24.9175 33.75 26.1525 30 28.6275V32.5M30 41.25V42.5" stroke="white" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            {question}
          </div>
        </div>
        <div className={classes.ButtonPanel}>
          <button type="button" className={classes.HintButton} onClick={() => setHintVisible(true)}>
            Hint
          </button>
          <button type="button" className={classes.SubmitButton} onClick={submit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

PracticePage.propTypes = {
  type: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  data: PropTypes.oneOf([
    PropTypes.shape({
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ]).isRequired,
  hints: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PracticePage;
