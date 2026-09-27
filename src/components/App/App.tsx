import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';
import {
  createNote,
  deleteNote,
  fetchNotes,
  type CreateNoteParams,
} from '../../services/noteService';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';

const NOTES_PER_PAGE = 12;
const SEARCH_DELAY = 300;

function App() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, SEARCH_DELAY);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    updateSearch(value);
  };

  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: NOTES_PER_PAGE,
        search: search || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      setPage(1);
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
      toast.success('Note created');
    },
    onError: () => {
      toast.error('Failed to create the note');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      if (page > 1 && data?.notes.length === 1) {
        setPage((currentPage) => currentPage - 1);
      }

      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },
    onError: () => {
      toast.error('Failed to delete the note');
    },
  });

  const handleCreateNote = async (values: CreateNoteParams) => {
    try {
      await createMutation.mutateAsync(values);
    } catch {
      // The mutation callback displays the error and the modal stays open.
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteMutation.mutate(noteId);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />

      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p role="status">Loading notes...</p>}
      {isError && <p role="alert">Failed to load notes. Please try again.</p>}
      {isFetching && !isLoading && <p role="status">Updating notes...</p>}

      {data && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={handleDeleteNote}
          deletingNoteId={
            deleteMutation.isPending ? deleteMutation.variables : null
          }
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
