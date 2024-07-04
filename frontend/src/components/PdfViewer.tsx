import React from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import './PdfViewer.scss'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface Props {
    file: File | null | string; // PDFファイルのURL
    slideHandle: () => void;
    started: boolean;
}

const PdfViewer: React.FC<Props> = ({file, slideHandle, started}) => {
    const [numPages, setNumPages] = React.useState(0);
    const [pageNumber, setPageNumber] = React.useState(1);

    // PDFファイルのページ数を取得する
    const onDocumentLoadSuccess = ({numPages}: { numPages: number }) => {
        setNumPages(numPages);
    };

    // ページ番号を変更する
    const changePage = (offset: number) => {
        if (offset === 1 && pageNumber >= 1 && pageNumber < numPages) {
            slideHandle()
            setPageNumber((prevPageNumber) => prevPageNumber + offset);
        }
    };

    return (
        <div className='pdf-container' onClick={() => started ? changePage(1) : null}>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber}/>
            </Document>
            <div>
                Page {pageNumber} of {numPages}
            </div>
            {/*<button onClick={() => changePage(-1)}>Previous</button>*/}
        </div>
    );
};

export default PdfViewer;
