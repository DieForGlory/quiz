import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api';

export default function LeadsView() {
  const { id } = useParams();
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.getLeads(id).then(setLeads);
  }, [id]);

  return (
    <div className="card">
      <h2>Собранные заявки (Квиз #{id})</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th>Контакты</th>
            <th>Ответы (Log)</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{new Date(lead.created_at).toLocaleString('ru-RU')}</td>
              <td>{JSON.stringify(lead.contact_data)}</td>
              <td>{JSON.stringify(lead.answers_log)}</td>
            </tr>
          ))}
          {leads.length === 0 && <tr><td colSpan="4">Нет заявок</td></tr>}
        </tbody>
      </table>
    </div>
  );
}