import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card } from '@/components/ui/card';

export default function AdminEmailLogs() {
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmailLogs();
  }, []);

  const loadEmailLogs = async () => {
    try {
      const res = await api.get('/admin/email-logs');
      setEmailLogs(res.data.data);
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Logs de E-mail</h1>
        <p className="text-muted-foreground">Histórico de e-mails enviados pelo sistema.</p>
      </div>

      <Card className="bg-card border-border shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Detalhe/Erro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {emailLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum e-mail enviado ainda.
                  </td>
                </tr>
              ) : (
                emailLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">{log.email}</td>
                    <td className="px-4 py-3 font-medium text-muted-foreground">{log.type}</td>
                    <td className="px-4 py-3">
                      {log.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500">
                          Sucesso
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-500/10 text-red-500">
                          Falha
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {log.errorMsg || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
