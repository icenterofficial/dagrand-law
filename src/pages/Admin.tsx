
import React, { useEffect, useState } from 'react';
import { useAuth, User } from '../contexts/AuthContext';
import { Scale, Lock, ArrowRight, LogOut, Users, FileText, Plus, Check, X, Trash2, CloudOff, Database, Loader2, ChevronDown, Edit, Image as ImageIcon, Calendar, Save, Menu, Eye, EyeOff, Globe, Upload, UserCog, Camera, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MOCK_UPDATES, PRACTICE_AREAS } from '../../constants';
import { LegalUpdate } from '../../types';
import { supabase, SUPABASE_URL } from '../lib/supabaseClient';
import { z } from 'zod';
import DOMPurify from 'dompurify';

const MotionDiv = motion.div as any;

// --- SECURITY: ZOD SCHEMAS ---
const InviteSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 chars").max(50, "Name too long"),
  password: z.string().min(6, "Password must be at least 6 chars").max(100),
  role: z.enum(['admin', 'editor'])
});

const ArticleSchema = z.object({
  title: z.string().min(5, "Title is too short").max(200, "Title is too long"),
  summary: z.string().min(10, "Summary is too short").max(500, "Summary is too long"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  // Allow data: URLs for local fallback
  image: z.string().min(5, "Image is required"), 
  content: z.array(z.string().min(1, "Paragraph cannot be empty")),
  author: z.object({
      id: z.string(),
      name: z.string(),
      avatar: z.string(),
      role: z.string()
  }).optional()
});

const Admin = () => {
  const { isAuthenticated, login, logout, user, users: contextUsers, addUser, isLoading: authLoading, isMockMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'team'>('content');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false); 
  const [loginLoading, setLoginLoading] = useState(false);

  // Team Management State
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  
  // Invite State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState(''); 
  const [invitePassword, setInvitePassword] = useState(''); 
  const [showInvitePassword, setShowInvitePassword] = useState(false);
  const [inviteRole, setInviteRole] = useState('editor');
  const [isInviting, setIsInviting] = useState(false);

  // Article State
  const [articles, setArticles] = useState<LegalUpdate[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<LegalUpdate[]>([]);
  const [categoryFilter] = useState(''); 
  const [searchQuery] = useState(''); 
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<LegalUpdate | null>(null);
  
  const [previewArticle, setPreviewArticle] = useState<LegalUpdate | null>(null);
  
  // Edit User Name & Avatar State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [avatarUploadingId, setAvatarUploadingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<LegalUpdate>>({
      title: '',
      date: '',
      summary: '',
      image: '',
      category: '',
      content: [''],
      author: undefined
  });

  // --- PERMISSION HELPERS ---
  const isAdmin = user?.role === 'admin';

  const canEditArticle = (article: LegalUpdate) => {
      // Admins can edit anything
      if (isAdmin) return true;
      // Users can edit if they are the author (compare IDs)
      if (user && article.authorId === user.id) return true;
      // Fallback: If authorId is missing but author object exists and names match (legacy/local check)
      if (user && article.author?.name === user.name) return true;
      
      return false;
  };

  const canManageTeam = () => isAdmin; 

  // --- HELPER: ROBUST EDGE FUNCTION CALLER ---
  const invokeAdminAction = async (action: string, payload: any = {}) => {
      // 1. Get Session
      let session = null;
      try {
          if (supabase) {
              const { data } = await supabase.auth.getSession();
              session = data.session;
          }
      } catch (e) {
          console.error("Error retrieving session:", e);
      }

      if (!session) throw new Error("No active session");

      // 2. Try Direct Fetch (More reliable than library invoke for debugging)
      // Use the exported SUPABASE_URL to prevent hardcoding mismatches
      const projectUrl = SUPABASE_URL; 
      const functionUrl = `${projectUrl}/functions/v1/admin-actions`;

      const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action, payload }),
      });

      if (!response.ok) {
          const errorText = await response.text();
          let errorJson;
          try { errorJson = JSON.parse(errorText); } catch(e) {}
          throw new Error(errorJson?.error || `Function Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
  };

  // --- FETCH USERS ---
  const fetchTeamMembers = async () => {
      setLoadingTeam(true);
      
      if (isMockMode || !supabase) {
          setTeamMembers(contextUsers);
          setLoadingTeam(false);
          return;
      }

      try {
          const data = await invokeAdminAction('listUsers');
          
          const mappedUsers: User[] = data.users.map((u: any) => ({
              id: u.id,
              email: u.email || '',
              name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Unknown',
              role: u.user_metadata?.role || 'editor',
              avatar: u.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${u.user_metadata?.full_name || 'User'}&background=153c63&color=fff`
          }));

          setTeamMembers(mappedUsers);
      } catch (err: any) {
          console.warn("Backend fetch failed, using local fallback:", err);
          setTeamMembers(contextUsers);
          if (activeTab === 'team') {
             // Only show toast if user is actually on the team tab to reduce noise
             // toast.error("Using Offline Data", { description: "Could not connect to user database." });
          }
      } finally {
          setLoadingTeam(false);
      }
  };

  useEffect(() => {
      if (activeTab === 'team' || isArticleModalOpen) {
          fetchTeamMembers();
      }
  }, [activeTab, isArticleModalOpen]);

  const fetchArticles = async () => {
    setIsLoadingArticles(true);
    
    if (isMockMode || !supabase) {
        setArticles(MOCK_UPDATES);
        setIsLoadingArticles(false);
        return;
    }

    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
            setArticles(data as LegalUpdate[]);
        }
    } catch (error) {
        setArticles(MOCK_UPDATES); 
    } finally {
        setIsLoadingArticles(false);
    }
  };

  useEffect(() => {
      if (isAuthenticated) {
          fetchArticles();
      }
  }, [isAuthenticated, isMockMode]);

  useEffect(() => {
    let result = articles;

    if (categoryFilter !== '') {
        result = result.filter(a => a.category === categoryFilter);
    }

    if (searchQuery !== '') {
        const query = searchQuery.toLowerCase();
        result = result.filter(a => 
            a.title.toLowerCase().includes(query) || 
            a.summary.toLowerCase().includes(query)
        );
    }

    setFilteredArticles(result);
  }, [articles, categoryFilter, searchQuery]);

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginLoading(true);
      const { success, error } = await login(email, password);
      setLoginLoading(false);
      if (!success) {
          toast.error('Login Failed', { description: error || 'Please check your email and password.', duration: 5000 });
      } else {
          toast.success('Welcome Back!', { description: 'Successfully logged into dashboard.' });
      }
  };

  // --- INVITE LOGIC ---
  const handleInvite = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canManageTeam()) {
          toast.error("Permission Denied");
          return;
      }

      setIsInviting(true);

      // 1. SECURITY: Validate Input with Zod
      const validationResult = InviteSchema.safeParse({
          email: inviteEmail,
          name: inviteName,
          password: invitePassword,
          role: inviteRole
      });

      if (!validationResult.success) {
          const errorMessage = validationResult.error.issues[0].message;
          toast.error("Validation Error", { description: errorMessage });
          setIsInviting(false);
          return;
      }

      // Helper for Local Create
      const createLocal = () => {
          const newUser: User = {
              id: `u${Date.now()}`,
              name: DOMPurify.sanitize(inviteName) || "New Member",
              email: inviteEmail,
              role: inviteRole as 'admin' | 'editor',
              avatar: `https://ui-avatars.com/api/?name=${inviteName || 'User'}&background=e2e8f0&color=64748b`,
              password: invitePassword 
          };
          addUser(newUser); 
          setTeamMembers(prev => [...prev, newUser]); 
          toast.success('User Created (Offline Mode)', { description: `Credentials: ${inviteEmail} / ${invitePassword}` });
          resetInviteForm();
          setIsInviting(false);
      };

      if (isMockMode || !supabase) {
          createLocal();
          return;
      }

      try {
          const data = await invokeAdminAction('createUser', {
              email: inviteEmail,
              password: invitePassword,
              fullName: DOMPurify.sanitize(inviteName), // Sanitize before sending
              role: inviteRole
          });

          if (data && data.error) throw new Error(data.error);

          toast.success('User Created Successfully', { 
              description: `User added to Supabase. Login with: ${inviteEmail}` 
          });
          
          await fetchTeamMembers();
          resetInviteForm();

      } catch (err: any) {
          console.error("Invite error:", err);
          toast.warning("Backend Failed - Created Locally", { description: err.message });
          createLocal();
      } finally {
          setIsInviting(false);
      }
  };

  const resetInviteForm = () => {
      setIsInviting(false);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      setInvitePassword('');
      setInviteName('');
      setShowInvitePassword(false);
  };

  const toggleRole = async (memberId: string, currentRole: string) => {
      if (!canManageTeam()) return;
      if (memberId === user?.id) return;

      const newRole = currentRole === 'admin' ? 'editor' : 'admin';
      
      setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole as 'admin' | 'editor' } : m));

      if (isMockMode || !supabase) {
          toast.success("Role Updated (Mock)");
          return;
      }

      try {
          const data = await invokeAdminAction('updateUser', {
              userId: memberId,
              attributes: { user_metadata: { role: newRole } }
          });
          if (data?.error) throw new Error(data.error);
          toast.success("Role Updated");
      } catch (err: any) {
          toast.warning("Role Updated Locally (Sync Failed)");
      }
  };

  const deleteUser = async (memberId: string) => {
      if (!canManageTeam()) return;
      if (memberId === user?.id) return;
      if (!confirm("Are you sure?")) return;

    //   const previous = [...teamMembers];
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));

      if (isMockMode || !supabase) {
          toast.success("User Removed (Mock)");
          return;
      }

      try {
          const data = await invokeAdminAction('deleteUser', { userId: memberId });
          if (data?.error) throw new Error(data.error);
          toast.success("User Deleted");
      } catch (err: any) {
          toast.warning("User Deleted Locally (Sync Failed)");
      }
  };

  const startEditUser = (member: User) => {
      if (user?.id !== member.id && !isAdmin) return; 
      setEditingUserId(member.id);
      setNewUserName(member.name);
  };

  const saveUserName = async (memberId: string) => {
      // Security: Basic sanitization
      const cleanName = DOMPurify.sanitize(newUserName.trim());
      if (!cleanName) return;
      
      setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, name: cleanName } : m));
      setEditingUserId(null);

      if (isMockMode || !supabase) {
          toast.success("Name Updated (Mock)");
          return;
      }

      try {
          const isSelf = memberId === user?.id;
          if (isSelf) {
              await supabase.auth.updateUser({ data: { full_name: cleanName } });
          } else {
              await invokeAdminAction('updateUser', {
                 userId: memberId,
                 attributes: { user_metadata: { full_name: cleanName } }
              });
          }
          toast.success("Name Updated");
      } catch (err: any) {
          toast.warning("Name Updated Locally (Sync Failed)");
      }
  };

  // --- NEW: HANDLE USER AVATAR UPLOAD ---
  const handleUserAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, memberId: string) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
          toast.error("Invalid file type");
          return;
      }

      setAvatarUploadingId(memberId);

      // MOCK MODE
      if (isMockMode || !supabase) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64 = reader.result as string;
              setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, avatar: base64 } : m));
              setAvatarUploadingId(null);
              toast.success("Profile Updated (Mock)");
          };
          reader.readAsDataURL(file);
          return;
      }

      // SUPABASE MODE
      try {
          const fileExt = file.name.split('.').pop();
          const fileName = `avatar_${memberId}_${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          // 1. Upload to 'avatars' bucket
          const { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(filePath, file);

          if (uploadError) throw uploadError;

          // 2. Get Public URL
          const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
          const publicUrl = data.publicUrl;

          // 3. Update User Metadata via Admin Action (or self update)
          const isSelf = memberId === user?.id;
          
          if (isSelf) {
              await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
          } else {
              await invokeAdminAction('updateUser', {
                  userId: memberId,
                  attributes: { user_metadata: { avatar_url: publicUrl } }
              });
          }

          // 4. Update Local State
          setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, avatar: publicUrl } : m));
          toast.success("Profile Picture Updated");

      } catch (error: any) {
          console.error("Avatar upload failed:", error);
          toast.error("Upload Failed", { description: error.message || "Storage bucket 'avatars' might be missing." });
      } finally {
          setAvatarUploadingId(null);
      }
  };

  const openNewArticleModal = () => {
      setEditingArticle(null);
      const defaultAuthor = user ? {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role === 'admin' ? 'Partner' : 'Legal Consultant'
      } : undefined;

      setFormData({
          title: '',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
          summary: '',
          image: '',
          category: '',
          content: [''],
          author: defaultAuthor
      });
      setIsArticleModalOpen(true);
  };

  const openEditArticleModal = (article: LegalUpdate) => {
      if (!canEditArticle(article)) {
          toast.error("Access Denied", { description: "You can only edit articles you created." });
          return;
      }
      setEditingArticle(article);
      setFormData({ ...article });
      setIsArticleModalOpen(true);
  };

  const deleteArticle = async (article: LegalUpdate) => {
      if (!canEditArticle(article)) {
          toast.error("Access Denied", { description: "You can only delete articles you created." });
          return;
      }

      if(!confirm("Are you sure you want to delete this article?")) return;

      const id = article.id;
      // Optimistic UI: Remove it immediately
      const prevArticles = [...articles];
      setArticles(prev => prev.filter(a => a.id !== id));

      if (isMockMode || !supabase) {
          toast.success("Article Deleted (Mock)");
          return;
      }

      try {
          const { error } = await supabase.from('articles').delete().eq('id', id);
          if (error) throw error;
          
          toast.success("Article Deleted");
          // Re-fetch to sync state just in case
          fetchArticles();
      } catch (error: any) {
          console.error("Delete error:", error);
          // If we failed, check if it's a permission issue. 
          // If so, we might want to keep the local deletion visible if the user really wants it gone from their view,
          // but strictly speaking we should revert.
          // However, for better UX in "mixed" states, we can show a warning instead of reverting.
          toast.error("Failed to delete from database", { 
              description: "Permission denied or network error. (Item removed from view)" 
          });
          // We DO NOT revert state here to satisfy the user who wants it gone from the UI at least.
          // setArticles(prevArticles); 
      }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      const finalImage = formData.image || 'https://picsum.photos/600/400';
      
      // SECURITY: Sanitize content before payload construction
      // Note: We're allowing some HTML tags now (b, i, u, ul, li) so we should be careful with sanitization policy
      // but DOMPurify on display side (UpdateDetail) is the main line of defense.
      // Here we just sanitize mostly to prevent script injection into DB.
      const sanitizedContent = (formData.content || []).map(p => DOMPurify.sanitize(p, { ALLOWED_TAGS: ['b', 'i', 'u', 'ul', 'ol', 'li', 'br', 'strong', 'em'] }));
      const sanitizedTitle = DOMPurify.sanitize(formData.title || '');
      const sanitizedSummary = DOMPurify.sanitize(formData.summary || '');

      // Determine Author ID logic
      let finalAuthorId = user?.id;
      let finalAuthorObj = formData.author;

      if (isAdmin) {
          // Admin can assign anyone
          if (formData.author?.id) {
              finalAuthorId = formData.author.id;
          }
      } else {
          // Author MUST be themselves if not admin
          finalAuthorId = user?.id;
          if (user) {
              finalAuthorObj = {
                  id: user.id,
                  name: user.name,
                  avatar: user.avatar,
                  role: user.role === 'admin' ? 'Partner' : 'Legal Consultant'
              };
          }
      }

      const payload = {
          title: sanitizedTitle || 'Untitled',
          date: formData.date || '',
          summary: sanitizedSummary || '',
          category: formData.category || 'General',
          image: finalImage,
          content: sanitizedContent,
          authorId: finalAuthorId,
          author: finalAuthorObj
      };

      // SECURITY: Validate with Zod
      const validationResult = ArticleSchema.safeParse(payload);
      if (!validationResult.success) {
          const errorMessage = validationResult.error.issues[0].message;
          toast.error("Validation Error", { description: errorMessage });
          setIsSubmitting(false);
          return;
      }

      // --- ROBUSTNESS: Local State Fallback Helper ---
      // This ensures that if the database write fails (e.g., RLS policy not set for local user),
      // the UI still updates, preventing data loss for the user session.
      const updateLocalState = (isError = false) => {
          if (editingArticle) {
              setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...a, ...payload, id: editingArticle.id } as LegalUpdate : a));
              if (isError) {
                  toast.warning("Article Updated Locally", { description: "Database permission denied. Saved to browser memory." });
              } else {
                  toast.success("Article Updated (Mock)");
              }
          } else {
              const newArticle = { ...payload, id: Date.now().toString() } as LegalUpdate;
              setArticles([newArticle, ...articles]);
              if (isError) {
                  toast.warning("Article Published Locally", { description: "Database permission denied. Saved to browser memory." });
              } else {
                  toast.success("Article Published (Mock)");
              }
          }
          setIsArticleModalOpen(false);
      };

      if (isMockMode || !supabase) {
          updateLocalState();
          setIsSubmitting(false);
          return;
      }

      try {
          let error = null;
          if (editingArticle) {
             const { error: updateError } = await supabase
                .from('articles')
                .update(payload)
                .eq('id', editingArticle.id);
             error = updateError;
          } else {
             const { error: insertError } = await supabase
                .from('articles')
                .insert([payload]);
             error = insertError;
          }

          if (error) throw error;

          toast.success(editingArticle ? "Article Updated" : "Article Published");
          await fetchArticles();
          setIsArticleModalOpen(false);

      } catch (error: any) {
          console.error("Save error:", error);
          // FALLBACK: Update local state so the user doesn't lose their work
          updateLocalState(true);
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleAuthorChange = (userId: string) => {
      const selectedUser = teamMembers.find(u => u.id === userId);
      if (selectedUser) {
          setFormData({
              ...formData,
              author: {
                  id: selectedUser.id,
                  name: selectedUser.name,
                  avatar: selectedUser.avatar,
                  role: selectedUser.role === 'admin' ? 'Partner' : 'Legal Consultant'
              }
          });
      }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // SECURITY: Check file type and size on client side
      if (!file.type.startsWith('image/')) {
          toast.error("Invalid file type", { description: "Please upload an image." });
          return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error("File too large", { description: "Image must be under 5MB." });
          return;
      }

      // Check if we are in Mock mode
      // NOTE: We attempt upload even without a session (Guest/Anon mode) if Supabase is connected.
      // This supports the "Local User" bypass if Storage Policies allow 'anon' inserts.
      if (isMockMode || !supabase) {
          toast.success("Image Uploaded (Mock Base64)");
          
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData({ ...formData, image: reader.result as string });
          };
          reader.readAsDataURL(file);
          return;
      }

      setIsUploadingImage(true);
      try {
          const fileExt = file.name.split('.').pop();
          // Generate a clean filename to prevent directory traversal attacks
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
              .from('blog-images')
              .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
          
          setFormData({ ...formData, image: data.publicUrl });
          toast.success("Image Uploaded Successfully");
      } catch (error: any) {
          console.error("Upload error:", error);
          
          // --- FALLBACK MECHANISM ---
          toast.warning("Cloud upload failed. Using local preview.", { 
            description: "Check Storage Policies (Allow 'anon' insert)." 
          });
          
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData(prev => ({ ...prev, image: reader.result as string }));
          };
          reader.readAsDataURL(file);

      } finally {
          setIsUploadingImage(false);
      }
  };

  const handleContentChange = (index: number, value: string) => {
      const newContent = [...(formData.content || [])];
      newContent[index] = value;
      setFormData({ ...formData, content: newContent });
  };

  const addParagraph = () => {
      setFormData({ ...formData, content: [...(formData.content || []), ''] });
  };

  const removeParagraph = (index: number) => {
      const newContent = [...(formData.content || [])];
      newContent.splice(index, 1);
      setFormData({ ...formData, content: newContent });
  };

  // --- RICH TEXT HELPERS ---
  const insertTag = (index: number, tag: string) => {
      const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);
      
      let replacement = '';
      
      // Determine format
      switch(tag) {
          case 'bold': replacement = `<b>${selectedText}</b>`; break;
          case 'italic': replacement = `<i>${selectedText}</i>`; break;
          case 'underline': replacement = `<u>${selectedText}</u>`; break;
          case 'ul': replacement = `\n<ul>\n  <li>${selectedText || 'Item'}</li>\n</ul>\n`; break;
          case 'ol': replacement = `\n<ol>\n  <li>${selectedText || 'Item'}</li>\n</ol>\n`; break;
          default: replacement = selectedText;
      }

      // Insert back into state
      const newText = text.substring(0, start) + replacement + text.substring(end);
      handleContentChange(index, newText);

      // Restore focus (optional, usually good UX)
      setTimeout(() => textarea.focus(), 0);
  };

  if (authLoading) return <div className="min-h-screen bg-brand-navy flex items-center justify-center"><Loader2 className="animate-spin text-brand-gold h-10 w-10" /></div>;

  if (!isAuthenticated) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] relative overflow-hidden font-sans">
              <div className="absolute top-0 left-0 w-full h-64 bg-brand-navy"></div>
              <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative z-10 mx-4">
                  <div className="text-center mb-8">
                       <img 
                          src="https://raw.githubusercontent.com/icenterofficial/dagrand/refs/heads/main/public/assets/images/logo.png" 
                          alt="Dagrand Law Office" 
                          className="h-16 w-auto mx-auto mb-6 object-contain"
                       />
                      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-1">Welcome Back</h2>
                      <p className="text-gray-400 text-xs uppercase tracking-widest">Dagrand Law Office</p>
                      {isMockMode && (
                          <div className="mt-4 px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wide rounded-full inline-block border border-orange-200">
                              Demo Mode Active
                          </div>
                      )}
                  </div>
                  <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</label>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-navy focus:bg-white outline-none rounded-lg text-sm" placeholder="admin@dagrand.net" required />
                      </div>
                      <div className="space-y-1.5 relative">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</label>
                          <div className="relative">
                            <input 
                                type={showLoginPassword ? "text" : "password"} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-brand-navy focus:bg-white outline-none rounded-lg text-sm pr-10" 
                                placeholder="••••••••" 
                                required 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy"
                            >
                                {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loginLoading}
                        className="w-full bg-brand-navy text-white font-bold py-3.5 rounded-lg text-sm hover:bg-brand-gold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                          {loginLoading ? 'Authenticating...' : <><Lock className="h-4 w-4" /> Login</>}
                      </button>
                  </form>
                  <div className="mt-8 text-center"><Link to="/" className="text-gray-400 hover:text-brand-navy text-xs font-medium flex items-center justify-center gap-2 transition-colors"><ArrowRight className="h-3 w-3 rotate-180" /> Back to Website</Link></div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
        
        <AnimatePresence>
            {isSidebarOpen && (
                <MotionDiv 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
            )}
        </AnimatePresence>

        <aside className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-72 bg-brand-navy flex flex-col shadow-2xl 
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            {/* Sidebar Header */}
            <div className="h-20 lg:h-24 flex flex-col items-center justify-center border-b border-white/10 bg-black/10 relative shrink-0">
                <img 
                   src="https://raw.githubusercontent.com/icenterofficial/dagrand/refs/heads/main/public/assets/images/logo.png" 
                   alt="Dagrand Law Office" 
                   className="h-10 lg:h-12 w-auto object-contain mb-2"
                />
                <span className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-medium">Admin Portal</span>
                <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white lg:hidden"
                >
                    <X className="h-6 w-6" />
                </button>
                {isMockMode && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500" title="Running in Mock Mode"></div>}
            </div>

            {/* Sidebar Menu */}
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                <button onClick={() => { setActiveTab('content'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group ${activeTab === 'content' ? 'bg-brand-gold text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <FileText className={`h-5 w-5 ${activeTab === 'content' ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                    <div className="text-left">
                        <span className="block text-sm font-bold">Articles</span>
                        <span className="block text-[10px] opacity-70 font-normal">Manage content</span>
                    </div>
                </button>
                <button onClick={() => { setActiveTab('team'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group ${activeTab === 'team' ? 'bg-brand-gold text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                    <Users className={`h-5 w-5 ${activeTab === 'team' ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                    <div className="text-left">
                        <span className="block text-sm font-bold">Team Access</span>
                        <span className="block text-[10px] opacity-70 font-normal">
                            {isAdmin ? 'Manage Users' : 'View Team'}
                        </span>
                    </div>
                </button>
                
                <div className="pt-4 mt-2 border-t border-white/10">
                    <Link to="/" className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 group">
                        <Globe className="h-5 w-5 text-gray-500 group-hover:text-brand-gold" />
                        <div className="text-left">
                            <span className="block text-sm font-bold">Back to Website</span>
                            <span className="block text-[10px] opacity-70 font-normal">View Public Site</span>
                        </div>
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
                <div className="flex items-center gap-3">
                    <img src={user?.avatar} alt="User" className="w-10 h-10 rounded-full border border-white/20" />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-white text-sm font-bold truncate">{user?.name}</p>
                        <div className="flex items-center gap-1.5">
                             <p className="text-gray-400 text-xs truncate capitalize">{user?.role}</p>
                             {isMockMode ? <CloudOff className="h-3 w-3 text-orange-400" /> : <Database className="h-3 w-3 text-green-400" />}
                        </div>
                    </div>
                    <button onClick={async () => { await logout(); toast.info("Logged Out"); }} className="text-gray-500 hover:text-red-400 transition-colors"><LogOut className="h-5 w-5" /></button>
                </div>
            </div>
        </aside>

        <main className="flex-1 relative overflow-hidden bg-[#f8fafc] w-full">
            {activeTab === 'content' && (
                <div className="absolute inset-0 overflow-y-auto">
                     <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-brand-navy">
                                <Menu className="h-6 w-6" />
                            </button>
                            <div>
                                <h2 className="text-xl lg:text-2xl font-serif font-bold text-brand-navy">Article Management</h2>
                                <p className="text-xs text-gray-500 hidden sm:flex items-center gap-2">Manage website updates and legal news.</p>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={openNewArticleModal}
                            className="bg-brand-navy text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-bold shadow-lg hover:bg-brand-gold transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New Article</span>
                        </button>
                    </div>

                    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-24">Image</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Title</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-40">Category</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-40">Date</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest w-32">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {isLoadingArticles ? (
                                            <tr><td colSpan={5} className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-2"><Loader2 className="animate-spin h-6 w-6 text-brand-navy" /> Loading articles...</td></tr>
                                        ) : filteredArticles.length === 0 ? (
                                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No articles found matching criteria.</td></tr>
                                        ) : (
                                            filteredArticles.map((article) => {
                                                const hasPermission = canEditArticle(article);
                                                return (
                                                <tr key={article.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                                                            <img src={article.image} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-brand-navy text-sm mb-1">{article.title}</div>
                                                        <div className="text-xs text-gray-400 line-clamp-1 mb-2">{article.summary}</div>
                                                        {article.author && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <img src={article.author.avatar} alt="" className="w-4 h-4 rounded-full" />
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase">{article.author.name}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4"><span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-brand-gold/10 px-2 py-1 rounded-sm">{article.category || 'General'}</span></td>
                                                    <td className="px-6 py-4"><span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">{article.date}</span></td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => setPreviewArticle(article)} className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 transition-colors"><Eye className="h-4 w-4" /></button>
                                                            
                                                            {hasPermission ? (
                                                                <>
                                                                    <button onClick={() => openEditArticleModal(article)} className="text-gray-400 hover:text-brand-navy p-2 rounded-full hover:bg-gray-200 transition-colors"><Edit className="h-4 w-4" /></button>
                                                                    <button onClick={() => deleteArticle(article)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-gray-300 italic px-2">Read Only</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )})
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'team' && (
                <div className="absolute inset-0 overflow-y-auto">
                     <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-brand-navy">
                                <Menu className="h-6 w-6" />
                            </button>
                            <div>
                                <h2 className="text-xl lg:text-2xl font-serif font-bold text-brand-navy">Team Members</h2>
                                <p className="text-xs text-gray-500 hidden sm:flex items-center gap-2">
                                    Manage access permissions 
                                    {isMockMode && <span className="text-orange-500 font-bold px-2 py-0.5 bg-orange-50 rounded-full border border-orange-100">Demo Mode</span>}
                                </p>
                            </div>
                        </div>
                        {isAdmin && (
                            <button 
                                type="button"
                                onClick={() => setIsInviteModalOpen(true)}
                                className="bg-brand-navy text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-bold shadow-lg hover:bg-brand-gold transition-all flex items-center gap-2 cursor-pointer relative z-50 active:scale-95"
                            >
                                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add Member</span>
                            </button>
                        )}
                    </div>

                    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loadingTeam ? (
                                            <tr><td colSpan={4} className="p-12 text-center text-gray-500"><Loader2 className="animate-spin h-6 w-6 mx-auto mb-2 text-brand-navy" /> Loading team...</td></tr>
                                        ) : teamMembers.map((member) => {
                                            const isCurrentUser = member.id === user?.id;
                                            const isEditing = editingUserId === member.id;
                                            const isAvatarUploading = avatarUploadingId === member.id;

                                            return (
                                            <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {/* AVATAR UPLOAD SECTION */}
                                                        <div className="relative group/avatar cursor-pointer">
                                                            {isAvatarUploading ? (
                                                                <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
                                                                    <Loader2 className="h-4 w-4 animate-spin text-brand-navy" />
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <img src={member.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                                                                    {isEditing && (
                                                                        <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-100 transition-opacity cursor-pointer">
                                                                            <Camera className="h-4 w-4 text-white" />
                                                                            <input 
                                                                                type="file" 
                                                                                className="hidden" 
                                                                                accept="image/*"
                                                                                onChange={(e) => handleUserAvatarUpload(e, member.id)}
                                                                            />
                                                                        </label>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* NAME EDIT SECTION */}
                                                        <div>
                                                            {isEditing ? (
                                                                <div className="flex items-center gap-2">
                                                                    <input 
                                                                        autoFocus
                                                                        type="text" 
                                                                        value={newUserName}
                                                                        onChange={(e) => setNewUserName(e.target.value)}
                                                                        className="border border-brand-gold rounded px-2 py-1 text-sm outline-none w-32 md:w-auto"
                                                                        onKeyDown={(e) => e.key === 'Enter' && saveUserName(member.id)}
                                                                    />
                                                                    <button onClick={() => saveUserName(member.id)} className="p-1 hover:bg-green-100 rounded text-green-600"><Check className="h-4 w-4" /></button>
                                                                    <button onClick={() => setEditingUserId(null)} className="p-1 hover:bg-red-100 rounded text-red-500"><X className="h-4 w-4" /></button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 group/edit">
                                                                    <div className="font-bold text-gray-900 text-sm">{member.name}</div>
                                                                    {(isCurrentUser || isAdmin) && (
                                                                        <button onClick={() => startEditUser(member)} className="opacity-0 group-hover/edit:opacity-100 text-gray-400 hover:text-brand-navy transition-opacity">
                                                                            <UserCog className="h-3 w-3" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-gray-500">{member.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isAdmin ? (
                                                        <button 
                                                            onClick={() => toggleRole(member.id, member.role)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize transition-all border ${
                                                                member.role === 'admin' 
                                                                ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100' 
                                                                : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                                                            }`}
                                                        >
                                                            {member.role}
                                                            <ChevronDown className="h-3 w-3 opacity-50" />
                                                        </button>
                                                    ) : (
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                                                            member.role === 'admin' 
                                                            ? 'bg-purple-50 text-purple-800 border-purple-200' 
                                                            : 'bg-blue-50 text-blue-800 border-blue-200'
                                                        }`}>
                                                            {member.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${member.name.includes("Pending") ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`}></div>
                                                        <span className="text-xs font-medium text-gray-600">{member.name.includes("Pending") ? 'Invite Sent' : 'Active'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {isAdmin && !isCurrentUser ? (
                                                        <button onClick={() => deleteUser(member.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-300 text-xs">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
        
        <AnimatePresence>
            {previewArticle && (
                <MotionDiv 
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                    className="fixed inset-0 z-[110] bg-white overflow-y-auto"
                >
                     <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Preview Mode</span>
                        </div>
                        <button onClick={() => setPreviewArticle(null)} className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-brand-gold transition-all"><X className="h-4 w-4" /> Close Preview</button>
                    </div>
                    <div className="relative h-[50vh] min-h-[300px]">
                        <img src={previewArticle.image} alt={previewArticle.title} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-brand-navy/60 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                            <div className="max-w-7xl mx-auto">
                                <h1 className="text-2xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg">{previewArticle.title}</h1>
                                <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
                                    <div className="flex items-center gap-2"><span className="bg-brand-gold text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest">{previewArticle.category || 'General'}</span></div>
                                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-gold" />{previewArticle.date}</div>
                                    {previewArticle.author && (
                                        <div className="flex items-center gap-2">
                                            <img src={previewArticle.author.avatar} alt="" className="w-5 h-5 rounded-full border border-white/30" />
                                            <span>{previewArticle.author.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-4xl mx-auto px-6 py-16">
                         <div className="prose prose-lg prose-headings:font-serif prose-headings:text-brand-navy prose-p:text-gray-600 prose-p:font-light prose-p:leading-loose max-w-none first-letter:text-5xl first-letter:font-serif first-letter:text-brand-gold first-letter:mr-3 first-letter:float-left">
                           <p className="lead font-medium text-xl text-brand-navy italic mb-8 border-l-4 border-brand-gold pl-4">{previewArticle.summary}</p>
                           {previewArticle.content.map((paragraph, idx) => (
                               <p key={idx} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraph) }}></p>
                           ))}
                       </div>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {isArticleModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsArticleModalOpen(false)} className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" />
                    <MotionDiv initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white w-full md:max-w-2xl h-full md:h-auto md:max-h-[90vh] rounded-xl shadow-2xl relative z-10 overflow-hidden flex flex-col">
                        <div className="bg-brand-navy p-6 flex items-center justify-between shrink-0">
                            <h3 className="text-white font-serif font-bold text-xl">{editingArticle ? 'Edit Article' : 'New Article'}</h3>
                            <button onClick={() => setIsArticleModalOpen(false)} className="text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="articleForm" onSubmit={handleSaveArticle} className="space-y-6">
                                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-navy focus:bg-white outline-none" placeholder="Article Headline" required /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date</label><div className="relative"><Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-navy focus:bg-white outline-none" placeholder="OCTOBER 24, 2024" /></div></div>
                                    <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label><div className="relative"><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-navy focus:bg-white outline-none appearance-none"><option value="">Select a Category</option>{PRACTICE_AREAS.map(area => (<option key={area.id} value={area.title}>{area.title}</option>))}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><ChevronDown className="h-4 w-4" /></div></div></div>
                                </div>
                                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Author</label><div className="relative"><select value={formData.author?.id || ''} onChange={e => handleAuthorChange(e.target.value)} disabled={!isAdmin} className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-navy focus:bg-white outline-none appearance-none ${!isAdmin ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}><option value="">Select Author</option>{teamMembers.map(member => (<option key={member.id} value={member.id}>{member.name}</option>))}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><ChevronDown className="h-4 w-4" /></div></div></div>

                                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cover Image</label><div className="bg-gray-50 border border-gray-200 rounded-lg p-4">{formData.image && (<div className="mb-4 relative h-40 w-full rounded-md overflow-hidden border border-gray-200"><img src={formData.image} alt="Preview" className="w-full h-full object-cover" /><button type="button" onClick={() => setFormData({...formData, image: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"><X className="h-3 w-3" /></button></div>)}<div className="flex gap-4 items-start"><div className="flex-1 space-y-2"><label className="text-[10px] uppercase font-bold text-gray-400">Option 1: Paste URL</label><div className="relative"><ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><input type="text" value={formData.image && !formData.image.startsWith('http') && !formData.image.startsWith('data') ? '' : formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:border-brand-navy outline-none" placeholder="https://..." /></div></div><div className="w-[1px] bg-gray-200 self-stretch"></div><div className="flex-1 space-y-2"><label className="text-[10px] uppercase font-bold text-gray-400">Option 2: Upload File</label><label className={`flex items-center justify-center gap-2 w-full py-2 bg-white border border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-brand-gold hover:text-brand-navy cursor-pointer transition-all ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>{isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}<span>{isUploadingImage ? 'Uploading...' : 'Choose File'}</span><input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage}/></label></div></div></div></div>
                                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Summary</label><textarea rows={2} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-brand-navy focus:bg-white outline-none" placeholder="Brief description for the card preview..." /></div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Content Paragraphs</label><button type="button" onClick={addParagraph} className="text-xs text-brand-navy font-bold hover:text-brand-gold flex items-center gap-1">+ Add Paragraph</button></div>
                                    {formData.content?.map((para, idx) => (
                                        <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-gold/20 focus-within:border-brand-gold/50 transition-all">
                                            {/* RICH TEXT TOOLBAR */}
                                            <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-100/50">
                                                <button type="button" onClick={() => insertTag(idx, 'bold')} title="Bold" className="p-1.5 hover:bg-gray-200 rounded text-gray-600 hover:text-black transition-colors"><Bold className="h-3.5 w-3.5" /></button>
                                                <button type="button" onClick={() => insertTag(idx, 'italic')} title="Italic" className="p-1.5 hover:bg-gray-200 rounded text-gray-600 hover:text-black transition-colors"><Italic className="h-3.5 w-3.5" /></button>
                                                <button type="button" onClick={() => insertTag(idx, 'underline')} title="Underline" className="p-1.5 hover:bg-gray-200 rounded text-gray-600 hover:text-black transition-colors"><Underline className="h-3.5 w-3.5" /></button>
                                                <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                                                <button type="button" onClick={() => insertTag(idx, 'ul')} title="Bullet List" className="p-1.5 hover:bg-gray-200 rounded text-gray-600 hover:text-black transition-colors"><List className="h-3.5 w-3.5" /></button>
                                                <button type="button" onClick={() => insertTag(idx, 'ol')} title="Numbered List" className="p-1.5 hover:bg-gray-200 rounded text-gray-600 hover:text-black transition-colors"><ListOrdered className="h-3.5 w-3.5" /></button>
                                                
                                                {formData.content!.length > 1 && (
                                                    <button type="button" onClick={() => removeParagraph(idx)} className="ml-auto text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                                )}
                                            </div>
                                            <textarea 
                                                id={`content-${idx}`}
                                                rows={4} 
                                                value={para} 
                                                onChange={e => handleContentChange(idx, e.target.value)} 
                                                className="w-full px-4 py-3 bg-transparent border-none outline-none text-sm resize-y" 
                                                placeholder={`Paragraph ${idx + 1} content...`} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3">
                            <button onClick={() => setIsArticleModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-200 transition-all">Cancel</button>
                            <button type="submit" form="articleForm" disabled={isSubmitting || isUploadingImage} className="bg-brand-navy text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-brand-gold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isSubmitting ? 'Saving...' : 'Save Article'}</button>
                        </div>
                    </MotionDiv>
                </div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetInviteForm} className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" />
                    <MotionDiv initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white w-full max-w-sm rounded-xl shadow-2xl relative z-10 p-6">
                        <h3 className="text-xl font-serif font-bold text-brand-navy mb-4">Invite New Member</h3>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div className="space-y-1.5"><label className="text-[10px] uppercase font-bold text-gray-500">Full Name</label><input type="text" value={inviteName} onChange={e => setInviteName(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-navy outline-none" required placeholder="John Doe" /></div>
                            <div className="space-y-1.5"><label className="text-[10px] uppercase font-bold text-gray-500">Email Address</label><input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-navy outline-none" required placeholder="john@dagrand.net" /></div>
                            <div className="space-y-1.5"><label className="text-[10px] uppercase font-bold text-gray-500">Temporary Password</label><div className="relative"><input type={showInvitePassword ? "text" : "password"} value={invitePassword} onChange={e => setInvitePassword(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-navy outline-none pr-10" required minLength={6} /><button type="button" onClick={() => setShowInvitePassword(!showInvitePassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy">{showInvitePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                            <div className="space-y-1.5"><label className="text-[10px] uppercase font-bold text-gray-500">Role</label><select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-navy outline-none"><option value="editor">Editor (Can create content)</option><option value="admin">Admin (Full Access)</option></select></div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={resetInviteForm} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" disabled={isInviting} className="px-6 py-2 bg-brand-navy text-white text-sm font-bold rounded shadow hover:bg-brand-gold transition-colors disabled:opacity-50 flex items-center gap-2">{isInviting ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}{isInviting ? 'Inviting...' : 'Send Invite'}</button>
                            </div>
                        </form>
                    </MotionDiv>
                </div>
            )}
        </AnimatePresence>

    </div>
  );
};

export default Admin;
