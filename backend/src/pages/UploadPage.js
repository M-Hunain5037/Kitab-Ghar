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
  const [showCoverPreviewButton, setShowCoverPreviewButton] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
    setShowCoverPreviewButton(true);
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
      await axios.post(`${API_BASE_URL}/api/upload/book`, formData, {
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

  const handleRemoveCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreviewUrl('');
    setShowCoverPreviewButton(false);
    setShowCoverPreview(false);
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
                  accept="application/pdf"
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
            {showCoverPreviewButton && (
              <Button type="button" onClick={() => setShowCoverPreview(true)}>
                Preview Cover Page
              </Button>
            )}
            {!coverImageFile && (
              <FileInputLabel htmlFor="coverImageInput">
                Select cover image
                <FileInput
                  id="coverImageInput"
                  type="file"
                  onChange={handleCoverImageChange}
                  accept="image/png, image/jpeg"
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
            <ButtonContainer>
              <Button type="button" onClick={() => setShowCoverPreview(false)}>
                Close
              </Button>
              <RemoveButton type="button" onClick={handleRemoveCoverImage}>
                Remove Image
              </RemoveButton>
              <FileInputLabel htmlFor="replaceCoverImageInput">
                Replace cover image
                <FileInput
                  id="replaceCoverImageInput"
                  type="file"
                  onChange={handleCoverImageChange}
                  accept="image/png, image/jpeg"
                />
              </FileInputLabel>
            </ButtonContainer>
          </ModalContent>
        </CoverImageModal>
      )}
    </Container>
  );
};

// Existing styles retained and combined with new styles where necessary
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  min-height: 80vh;
  gap: 2rem;
  flex-wrap: wrap;
  background: #1c1c1c;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 600px;
`;

const UploadBox = styled.div`
  background: #fff;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #fff;
    transform: none;
  }

  h2 {
    text-align: center;
    color: #d4af37;
    margin-bottom: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FileInputLabel = styled.label`
  display: block;
  padding: 0.75rem 1.5rem;
  border: 2px dashed #d4af37;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  color: #d4af37;
  background-color: #fff;
  margin-left: 1rem;

  &:hover {
    background-color: #444;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  font-size: 1rem;

  &:focus {
    border-color: #d4af37;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.5);
  }
`;

const TextArea = styled.textarea`
  width: 90%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    border-color: #d4af37;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.5);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #d4af37;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b89930;
  }
`;

const PreviewSection = styled.div`
  width: 90%;
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
    color: #d4af37;
  }

  iframe {
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
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
  background: rgba(0, 0, 0, 0.75);
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 1001;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  z-index: 1002;
  width: 90%;
  max-width: 500px;
  text-align: center;

  h2 {
    margin-bottom: 1rem;
    color: #d4af37;
  }
`;

const CoverPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const CoverImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TagContainer = styled.div`
  margin-bottom: 1rem;

  .ReactTags__tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border: 1px solid #444;
    border-radius: 5px;
    padding: 0.75rem;
    background-color: #fff;
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
    background-color: transparent;
    color: #333;
  }

  .ReactTags__tag {
    background: #d4af37;
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

      &:hover {
        background: #d4af37;
        color: white;
      }
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
`;

const RemoveButton = styled(Button)`
  background-color: #ff4d4f;

  &:hover {
    background-color: #d9534f;
  }
`;

export default UploadPage;
