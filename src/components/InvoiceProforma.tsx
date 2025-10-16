import React from 'react';
import '../styles/print.css';

type InvoiceItem = {
  id: number;
  designation: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type InvoiceData = {
  invoiceNo: string;
  date: string;
  client: string;
  project: string;
  items: InvoiceItem[];
};

type Props = {
  data?: InvoiceData;
};

const defaultData: InvoiceData = {
  invoiceNo: 'D2500035',
  date: '07 Août 2025',
  client: 'M. AGBESSI',
  project: 'STREAMING',
  items: [
    {
      id: 1,
      designation: 'Caméra',
      description:
        "Sujet sur le bipied, une sur plan large, une sur stabilisateur, détails questionnaires",
      quantity: 1,
      unitPrice: 55000,
    },
    { id: 2, designation: 'Un photographe', description: '', quantity: 1, unitPrice: 150000 },
    { id: 3, designation: 'Écran de 6m²', description: '', quantity: 2, unitPrice: 900000 },
  ],
};

function formatCurrency(value: number): string {
  return value.toLocaleString('fr-FR');
}

function InvoiceProforma({ data = defaultData }: Props) {
  const { invoiceNo, date, client, project, items } = data;
  const totalHT = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <div className="print-container recommended-template" style={{ width: '210mm', padding: '10mm', margin: '0 auto', color: '#000', fontFamily: 'Arial, sans-serif' }}>
      <div className="recommended-header print-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        {/* En-tête: image gauche + infos entreprise droite */}
        <img src="/factureimage/header.jpg.jpg" alt="EDIBA INTER" style={{ maxWidth: '45%' }} />
        <div className="company-info" style={{ textAlign: 'right', fontSize: '10pt' }}>
          <div><span className="label">Raison Sociale :</span> EDIBA INTER SARL U</div>
          <div><span className="label">Adresse :</span> Agbalépedo, Rue 335 AGP, Lomé</div>
          <div><span className="label">Tél :</span> +228 92 60 05 42 / 93 39 18 70</div>
          <div><span className="label">Email :</span> edibainter@gmail.com</div>
          <div><span className="label">Date de création :</span> 20 Août 2021</div>
          <div><span className="label">Statut Juridique :</span> SARL U</div>
          <div><span className="label">Régime fiscal :</span> Réel avec TVA</div>
          <div><span className="label">NIF :</span> 1001694526</div>
        </div>
      </div>

      <div className="document-title" style={{ textAlign: 'center', margin: '12pt 0' }}>
        FACTURE PROFORMA N° {invoiceNo}
      </div>

      <div className="document-date" style={{ marginBottom: 8 }}>Date : {date}</div>
      <div className="client-info" style={{ marginBottom: 8 }}>Client : {client}</div>
      <div style={{ textAlign: 'center', fontWeight: 700, marginTop: 8 }}>{project}</div>

      <table className="items-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: 4 }}>N°</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Désignation</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Description</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Quantité</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Prix Unitaire</th>
            <th style={{ border: '1px solid #000', padding: 4 }}>Montant</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.id}</td>
              <td style={{ border: '1px solid #000', padding: 4 }}>{item.designation}</td>
              <td style={{ border: '1px solid #000', padding: 4, textAlign: 'left' }}>
                {item.description ? item.description.split('\n').map((line, i) => (<div key={i}>{line}</div>)) : ''}
              </td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.quantity}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{formatCurrency(item.unitPrice)}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{formatCurrency(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 700 }}>TOTAL HT</td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 700 }}>{formatCurrency(totalHT)}</td>
          </tr>
        </tbody>
      </table>

      <div className="amount-in-words" style={{ marginTop: 12 }}>
        Arrêté la présente facture proforma à la somme de :
        <br />
        {/* Exemple: convertir totalHT en texte si besoin */}
        ... deux million sept cents quatre-vingt-dix mille Francs CFA.
      </div>

      <div className="signature" style={{ textAlign: 'right', marginTop: 32 }}>
        La Directrice<br />
        <strong>ALAYI Abide</strong><br />
        <a href="mailto:edibainter@gmail.com">edibainter@gmail.com</a>
      </div>

      <div className="recommended-footer print-footer" style={{ marginTop: 16, textAlign: 'center' }}>
        <img src="/factureimage/footer.jpg.jpg" alt="Pied de page" />
      </div>

      <div className="no-print" style={{ marginTop: 16, textAlign: 'center' }}>
        <button onClick={() => window.print()} style={{ padding: '8px 12px', border: '1px solid #000', borderRadius: 4 }}>Imprimer / Exporter en PDF</button>
      </div>
    </div>
  );
}

export default InvoiceProforma;


