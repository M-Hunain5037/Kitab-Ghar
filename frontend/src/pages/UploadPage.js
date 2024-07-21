import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const UploadPage = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [authorTags, setAuthorTags] = useState([]);
  const [description, setDescription] = useState('');
  const [genreTags, setGenreTags] = useState([]);
  const [languageTags, setLanguageTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [showCoverPreview, setShowCoverPreview] = useState(false);

  const handleFileChange = (e) => {
    setBookFile(e.target.files[0]);
    const fileUrl = URL.createObjectURL(e.target.files[0]);
    setPreviewUrl(fileUrl);
    setIsFileSelected(true);
  };

  const handleCoverImageChange = (e) => {
    setCoverImageFile(e.target.files[0]);
    const fileUrl = URL.createObjectURL(e.target.files[0]);
    setCoverImagePreviewUrl(fileUrl);
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    const tagNames = tags.map(tag => tag.text);
    const formData = new FormData();
    formData.append('bookFile', bookFile);
    formData.append('coverImageFile', coverImageFile);
    formData.append('title', title);
    formData.append('authors', authorTags.map(tag => tag.text).join(','));
    formData.append('description', description);
    formData.append('genres', genreTags.map(tag => tag.text).join(','));
    formData.append('languages', languageTags.map(tag => tag.text).join(','));
    formData.append('tags', tagNames.join(','));
    formData.append('userId', userId);
    formData.append('userName', localStorage.getItem('userName'));

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/upload/book', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Book uploaded successfully');
    } catch (error) {
      alert('Error uploading book');
    }
  };

  const handleTagDelete = (i, setTagsFunction, tags) => {
    setTagsFunction(tags.filter((tag, index) => index !== i));
  };

  const handleTagAddition = (tag, setTagsFunction, tags) => {
    setTagsFunction([...tags, tag]);
    setTags([...tags, tag]);
  };

  return (
    <Container>
      <FormContainer>
        <UploadBox>
          <h2>Upload Book via File</h2>
          <Form onSubmit={handleSubmitFile}>
            {!isFileSelected && (
              <FileInputLabel htmlFor="fileInput">
                Drag & drop a file here or click to select a file
                <FileInput
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf" // Only accept PDF files
                  required
                />
              </FileInputLabel>
            )}
            <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <TagContainer>
              <ReactTags
                tags={authorTags}
                handleDelete={(i) => handleTagDelete(i, setAuthorTags, authorTags)}
                handleAddition={(tag) => handleTagAddition(tag, setAuthorTags, authorTags)}
                delimiters={delimiters}
                placeholder="Add authors"
              />
            </TagContainer>
            <TextArea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <TagContainer>
              <ReactTags
                tags={genreTags}
                handleDelete={(i) => handleTagDelete(i, setGenreTags, genreTags)}
                handleAddition={(tag) => handleTagAddition(tag, setGenreTags, genreTags)}
                delimiters={delimiters}
                placeholder="Add genres"
              />
            </TagContainer>
            <TagContainer>
              <ReactTags
                tags={languageTags}
                handleDelete={(i) => handleTagDelete(i, setLanguageTags, languageTags)}
                handleAddition={(tag) => handleTagAddition(tag, setLanguageTags, languageTags)}
                delimiters={delimiters}
                placeholder="Add languages"
              />
            </TagContainer>
            <TagContainer>
              <ReactTags
                tags={tags}
                handleDelete={(i) => handleTagDelete(i, setTags, tags)}
                handleAddition={(tag) => handleTagAddition(tag, setTags, tags)}
                delimiters={delimiters}
                placeholder="Add tags (e.g., English, Urdu)"
              />
            </TagContainer>
            {coverImagePreviewUrl ? (
              <>
                <CoverPreviewContainer>
                  <CoverImagePreview src={coverImagePreviewUrl} alt="Cover" />
                  <Button type="button" onClick={() => setShowCoverPreview(true)}>
                    Preview Cover Page
                  </Button>
                </CoverPreviewContainer>
              </>
            ) : (
              <FileInputLabel htmlFor="coverImageInput">
                Select cover image
                <FileInput
                  id="coverImageInput"
                  type="file"
                  onChange={handleCoverImageChange}
                  accept="image/png, image/jpeg" // Only accept image files
                  required
                />
              </FileInputLabel>
            )}
            <Button type="submit">Upload via File</Button>
          </Form>
        </UploadBox>
      </FormContainer>
      {previewUrl && (
        <PreviewSection>
          <h2>Book Preview</h2>
          <iframe src={previewUrl} width="100%" height="100%" />
        </PreviewSection>
      )}
      {showCoverPreview && coverImagePreviewUrl && (
        <CoverImageModal>
          <ModalOverlay onClick={() => setShowCoverPreview(false)} />
          <ModalContent>
            <h2>Cover Image Preview</h2>
            <CoverImage src={coverImagePreviewUrl} alt="Cover" />
            <Button type="button" onClick={() => setShowCoverPreview(false)}>
              Close
            </Button>
            <FileInputLabel htmlFor="replaceCoverImageInput">
              Replace cover image
              <FileInput
                id="replaceCoverImageInput"
                type="file"
                onChange={handleCoverImageChange}
                accept="image/png, image/jpeg" // Only accept image files
              />
            </FileInputLabel>
          </ModalContent>
        </CoverImageModal>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  min-height: 80vh;
  gap: 2rem;
  flex-wrap: wrap;
  background: #f0f2f5;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
`;

const UploadBox = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-sizing: border-box;

  &:hover {
    background-color: #e9ecef;
    transform: translateY(-5px);
  }

  h2 {
    text-align: center;
    color: #007BFF;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FileInputLabel = styled.label`
  display: block;
  width: 100%;
  padding: 1rem;
  border: 2px dashed #007BFF;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin-bottom: 1rem;
  color: #007BFF;
  background-color: #f8f9fa;

  &:hover {
    background-color: #e2e6ea;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    border-color: #007BFF;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    border-color: #007BFF;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const PreviewSection = styled.div`
  width: 100%;
  max-width: 600px;
  height: 719px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1rem;
    color: #007BFF;
  }

  iframe {
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CoverImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 90%;
  max-width: 500px;
  text-align: center;

  h2 {
    margin-bottom: 1rem;
    color: #007BFF;
  }
`;

const CoverPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CoverImagePreview = styled.img`
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const CoverImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TagContainer = styled.div`
  margin-bottom: 1rem;

  .ReactTags__tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0.75rem;
  }

  .ReactTags__tagInput {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }

  .ReactTags__tagInput input {
    border: none;
    outline: none;
    font-size: 1rem;
  }

  .ReactTags__tag {
    background: #007BFF;
    color: white;
    border-radius: 20px;
    padding-left: 0.5rem;
    padding-bottom: 0.25rem;
    margin: 0.25rem;
    display: flex;
    align-items: center;

    .ReactTags__remove {
      margin-left: 0.5rem;
      cursor: pointer;
      background: #ccc;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export default UploadPage;
