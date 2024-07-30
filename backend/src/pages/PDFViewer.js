import React from 'react';
import styled from 'styled-components';

const PDFViewer = ({ url }) => {
  return (
    <PDFContainer>
      <iframe src={url} width="100%" height="500px" title="PDF Preview" />
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
`;

export default PDFViewer;
