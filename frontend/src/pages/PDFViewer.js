import React from 'react';
import styled from 'styled-components';

const PDFViewer = ({ url }) => {
  return (
    <PDFContainer>
      <iframe src={url} title="PDF Preview" />
    </PDFContainer>
  );
};

const PDFContainer = styled.div`
  width: 100%;
  height: 500px;
  overflow: auto;
  border: 1px solid #ddd;
  background: #f9f9f9;
  padding: 1rem;

  iframe {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    height: 400px;
  }

  @media (max-width: 480px) {
    height: 300px;
    padding: 0.5rem;
  }
`;

export default PDFViewer;
