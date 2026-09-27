import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => void;
  deletingNoteId: string | null;
}

function NoteList({ notes, onDelete, deletingNoteId }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => {
        const isDeleting = deletingNoteId === note.id;

        return (
          <li className={css.listItem} key={note.id}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <button
                className={css.button}
                type="button"
                disabled={isDeleting}
                onClick={() => onDelete(note.id)}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default NoteList;
