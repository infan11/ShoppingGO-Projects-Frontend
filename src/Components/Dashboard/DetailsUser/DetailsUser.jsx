import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SkeletonLoader = () => {
  return (
    <div className="p-6 w-80 bg-white rounded-lg shadow-md animate-pulse mx-auto">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 rounded mb-3"></div>
      ))}
      <div className="w-32 h-32 bg-gray-300 rounded-full mt-4 mx-auto"></div>
    </div>
  );
};

const DetailsUser = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');
  const detailRef = useRef();

  useEffect(() => {
    if (id) {
      axiosSecure.get(`/users/${id}`)
        .then(res => {
          setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, axiosSecure]);

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess('Link copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const input = detailRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.name || 'user-details'}.pdf`);
    });
  };

  if (loading) return <SkeletonLoader />;

  if (!data) {
    return (
      <div className="p-6 w-80 bg-red-50 border border-red-300 rounded-lg text-red-700 text-center font-semibold mx-auto">
        No user data found.
      </div>
    );
  }

  return (
    <div className="mt-10 grid mx-auto items-center justify-center min-h-screen px-4 font-Kanit ">
      <div
        ref={detailRef}
        className="bg-white max-w-md w-full rounded-3xl shadow-2xl border-2 border-[#339179] p-8  print:bg-white print:shadow-none print:border-none print:p-0"
      >
        {data.photo && (
          <div className="flex justify-center mb-6">
            <img
              src={data.photo || "https://i.ibb.co.com/PGwHS087/profile-Imagw.jpg"}
              alt="User"
              className="w-36 h-36 object-cover rounded-full border-2 border-[#fff] shadow-xl transition-transform hover:scale-110 print:border-0 print:rounded-none print:shadow-none"
            />
          </div>
        )}

        <DetailRow label="_id" value={data._id} />
        <DetailRow label="Name" value={data.name} />
        <DetailRow label="Email" value={data.email} />
        <DetailRow label="Role" value={data.role} />
        <DetailRow label="Status" value={data.status} />
        <DetailRow label="Phone" value={data.phoneNumber} />
        <DetailRow label="Date of Birth" value={data.dob} />
      </div>

      <div className="mt-8 flex justify-center gap-6 w-full max-w-md">
        <button
          onClick={handleShareLink}
          className="px-5 py-2 bg-[#339179] text-white rounded-full shadow hover:bg-[#339179] transition duration-200 print:hidden"
        >
          Share Link
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-2 bg-[#339179] text-white rounded-full shadow hover:bg-[#339179] transition duration-200 print:hidden"
        >
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-5 py-2 bg-[#339179] text-white rounded-full shadow hover:bg-[#339179] transition duration-200 print:hidden"
        >
          Download PDF
        </button>
      </div>

      {copySuccess && (
        <p className="absolute top-8 text-[#339179] font-semibold">{copySuccess}</p>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <p className="mb-4 text-gray-800 text-lg print:text-black print:text-base print:mb-2">
    <span className="font-semibold text-[#339179] print:text-black">{label}:</span> {value || 'N/A'}
  </p>
);

export default DetailsUser;
