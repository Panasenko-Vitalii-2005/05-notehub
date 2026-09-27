import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import type { CreateNoteParams } from '../../services/noteService';
import type { NoteTag } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onSubmit: (values: CreateNoteParams) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const noteTags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const initialValues: CreateNoteParams = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema: Yup.ObjectSchema<CreateNoteParams> = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content must be at most 500 characters')
    .defined(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(noteTags, 'Select a valid tag')
    .required('Tag is required'),
});

function NoteForm({ onSubmit, onCancel, isSubmitting }: NoteFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={async (values, actions) => {
        await onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      {({ dirty, isSubmitting: isFormikSubmitting, isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              as="textarea"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" as="select" name="tag" className={css.select}>
              {noteTags.map((tag) => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={
                isSubmitting || isFormikSubmitting || !dirty || !isValid
              }
            >
              {isSubmitting ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;
