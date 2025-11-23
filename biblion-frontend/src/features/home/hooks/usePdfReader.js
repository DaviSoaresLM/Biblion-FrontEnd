import { useState, useEffect, useRef } from 'react';
import api from '../../../config/AxiosConfig.jsx';
import { useBooks } from '../hooks/useBooks.js';
import { getBookFromContext, getPdfUrl } from '../utils/bookUtils.js';

export const usePdfReader = (id, locationSearch, locationState) => {
    const { allBooks } = useBooks();
    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [title, setTitle] = useState('Leitor de PDF');
    const [textMode, setTextMode] = useState(false);
    const [twoColumns, setTwoColumns] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [textContent, setTextContent] = useState(null);
    const [book, setBook] = useState(null);
    const blobUrlRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams(locationSearch);
                const srcParam = params.get('src');
                if (srcParam) {
                    setPdfUrl(srcParam);
                    setTitle(params.get('title') || 'Leitor de PDF');
                    return;
                }

                const foundBook = await getBookFromContext(allBooks, id, locationState);
                if (!mounted) return;
                if (!foundBook) {
                    setTitle('Leitor de PDF');
                    setTextContent(null);
                    setBook(null);

                    // Se não encontrou book localmente, tentar fallback para sample.pdf quando id === 1
                    try {
                        const bookIdNum = Number(id);
                        if (bookIdNum === 1) {
                            const SAMPLE_PDF = '/dragoes-de-eter-_1_Cacadores-de-bruxas-Draccon_-Raphael.pdf';
                            const r = await fetch(SAMPLE_PDF);
                            if (r.ok) {
                                const b = await r.blob();
                                const u = URL.createObjectURL(b);
                                blobUrlRef.current = u;
                                setPdfUrl(u);
                            } else {
                                setPdfUrl(null);
                            }
                        } else {
                            setPdfUrl(null);
                        }
                    } catch (err) {
                        setPdfUrl(null);
                    }

                    return;
                }

                setBook(foundBook);
                setTitle(foundBook.title || 'Leitor de PDF');
                const foundText = foundBook.text || foundBook.content || null;
                if (foundText) setTextContent(foundText);

                const foundPdf = getPdfUrl(foundBook);
                if (foundPdf) {
                    try {
                        const isAbsolute = /^https?:\/\//i.test(foundPdf);
                        const shouldFetchBlob = !foundPdf.startsWith('data:') && (isAbsolute || foundPdf.startsWith('/'));
                        if (shouldFetchBlob) {
                            const res = await api.get(foundPdf, { responseType: 'blob' });
                            const u = URL.createObjectURL(res.data);
                            blobUrlRef.current = u;
                            setPdfUrl(u);
                        } else {
                            setPdfUrl(foundPdf);
                        }
                    } catch (err) {
                        console.warn('usePdfReader: Falha ao buscar PDF via blob, usando URL direta:', err);
                        setPdfUrl(foundPdf);
                    }
                } else {
                    // fallback local temporário: usar `public/sample.pdf` se presente
                    const SAMPLE_PDF = '/dragoes-de-eter-_1_Cacadores-de-bruxas-Draccon_-Raphael.pdf';
                    try {
                        const r = await fetch(SAMPLE_PDF);
                        if (!mounted) return;
                        if (r.ok) {
                            const b = await r.blob();
                            const u = URL.createObjectURL(b);
                            blobUrlRef.current = u;
                            setPdfUrl(u);
                        } else {
                            setPdfUrl(null);
                        }
                    } catch (err) {
                        // não encontrou sample ou erro, manter sem pdf
                        setPdfUrl(null);
                    }
                }
            } catch (err) {
                console.warn('usePdfReader: Erro ao carregar livro para leitura:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [id, locationSearch, locationState, allBooks]);

    // limpar blob url ao desmontar
    useEffect(() => {
        return () => {
            if (blobUrlRef.current) {
                try { URL.revokeObjectURL(blobUrlRef.current); } catch (e) {}
                blobUrlRef.current = null;
            }
        };
    }, []);

    const toggleTextMode = () => setTextMode(v => !v);
    const toggleTwoColumns = () => setTwoColumns(v => !v);

    return {
        loading,
        pdfUrl,
        title,
        textMode,
        toggleTextMode,
        twoColumns,
        toggleTwoColumns,
        zoom,
        setZoom,
        textContent,
        book
    };
};

export default usePdfReader;
