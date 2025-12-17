import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, FolderOpen, MessageSquare, Plus, Trash2, Edit2, Eye, EyeOff, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'>;
type QuoteRequest = Tables<'quote_requests'>;

const Admin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/auth');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
    enabled: isAdmin,
  });

  const { data: quoteRequests = [], isLoading: loadingQuotes } = useQuery({
    queryKey: ['admin-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as QuoteRequest[];
    },
    enabled: isAdmin,
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: 'Projet supprimé' });
    },
  });

  const toggleQuoteRead = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const { error } = await supabase.from('quote_requests').update({ is_read: isRead }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
    },
  });

  const deleteQuote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quote_requests').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
      toast({ title: 'Demande supprimée' });
    },
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const unreadCount = quoteRequests.filter(q => !q.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-foreground">RSS Studio Admin</h1>
            <p className="font-sans text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Projets ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Demandes de devis
              {unreadCount > 0 && (
                <span className="ml-1 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl text-foreground">Gestion des projets</h2>
              <Button onClick={() => navigate('/admin/project/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau projet
              </Button>
            </div>

            {loadingProjects ? (
              <div className="text-center py-12 text-muted-foreground">Chargement...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucun projet. Cliquez sur "Nouveau projet" pour en créer un.
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-card border border-border rounded-sm p-4 flex items-center gap-4"
                  >
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-20 h-20 object-cover rounded-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-foreground">{project.title}</h3>
                      <p className="font-sans text-sm text-muted-foreground">{project.category}</p>
                      {project.is_featured && (
                        <span className="inline-block mt-1 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                          En vedette
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/admin/project/${project.id}`)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteProject.mutate(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quotes">
            <h2 className="font-serif text-xl text-foreground mb-6">Demandes de devis</h2>

            {loadingQuotes ? (
              <div className="text-center py-12 text-muted-foreground">Chargement...</div>
            ) : quoteRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucune demande de devis.
              </div>
            ) : (
              <div className="grid gap-4">
                {quoteRequests.map((quote) => (
                  <div
                    key={quote.id}
                    className={`bg-card border rounded-sm p-4 ${
                      quote.is_read ? 'border-border' : 'border-accent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-serif text-lg text-foreground">{quote.name}</h3>
                        <p className="font-sans text-sm text-muted-foreground">
                          {quote.email} {quote.phone && `• ${quote.phone}`}
                        </p>
                        {quote.service && (
                          <span className="inline-block mt-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                            {quote.service}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleQuoteRead.mutate({ id: quote.id, isRead: !quote.is_read })}
                          title={quote.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                        >
                          {quote.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteQuote.mutate(quote.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-sans text-sm text-foreground whitespace-pre-wrap">
                      {quote.message}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground mt-3">
                      {new Date(quote.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
