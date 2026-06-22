import axios from 'axios';
import { getToken, removeToken } from './auth';
import type { LoginResponse, AdminUser, AdminUserUpdate, ChangePasswordRequest } from '@/types/auth';
import type { HeroSlide, HeroSlideCreate, HeroSlideUpdate } from '@/types/hero-slide';
import type { Product, ProductCreate, ProductUpdate, ProductImage, ProductImageCreate } from '@/types/service';
import type {
  Project,
  ProjectListItem,
  ProjectCreate,
  ProjectUpdate,
  ProjectImage,
  ProjectImageCreate,
  ReorderItem,
} from '@/types/project';
import type { TeamMember, TeamMemberCreate, TeamMemberUpdate } from '@/types/team';
import type { Client, ClientCreate, ClientUpdate } from '@/types/client';
import type { Testimonial, TestimonialCreate, TestimonialUpdate } from '@/types/testimonial';
import type { JobOpening, JobOpeningCreate, JobOpeningUpdate, JobApplication, JobApplicationCreate } from '@/types/job';
import type { Certificate, CertificateCreate, CertificateUpdate } from '@/types/certificate';
import type { Inquiry, InquiryCreate } from '@/types/inquiry';
import type { SiteSettings, SiteSettingsUpdate } from '@/types/settings';
import type { DashboardResponse } from '@/types/dashboard';
import type { ProductItem, ProductItemCreate, ProductItemUpdate } from '@/types/service-product';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      removeToken();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  me: () => api.get<AdminUser>('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data: AdminUserUpdate) => api.put<AdminUser>('/auth/me', data),
  changePassword: (data: ChangePasswordRequest) =>
    api.put('/auth/change-password', data),
};

// ── Hero Slides ────────────────────────────────────────────────────────────────
export const heroSlidesApi = {
  list: () => api.get<HeroSlide[]>('/hero-slides'),
  create: (data: HeroSlideCreate) => api.post<HeroSlide>('/admin/hero-slides', data),
  update: (id: string, data: HeroSlideUpdate) =>
    api.put<HeroSlide>(`/admin/hero-slides/${id}`, data),
  delete: (id: string) => api.delete(`/admin/hero-slides/${id}`),
};

// ── Products ───────────────────────────────────────────────────────────────────
export const productsApi = {
  list: () => api.get<Product[]>('/products'),
  get: (slug: string) => api.get<Product>(`/products/${slug}`),
  create: (data: ProductCreate) => api.post<Product>('/admin/products', data),
  update: (id: string, data: ProductUpdate) =>
    api.put<Product>(`/admin/products/${id}`, data),
  delete: (id: string) => api.delete(`/admin/products/${id}`),
  addImage: (id: string, data: ProductImageCreate) =>
    api.post<ProductImage>(`/admin/products/${id}/images`, data),
  removeImage: (id: string, imgId: string) =>
    api.delete(`/admin/products/${id}/images/${imgId}`),
  reorderImages: (id: string, items: ReorderItem[]) =>
    api.patch<ProductImage[]>(`/admin/products/${id}/images/reorder`, { items }),
};

// ── Product Items ──────────────────────────────────────────────────────────────
export const productItemsApi = {
  listBySlug: (slug: string) => api.get<ProductItem[]>(`/products/${slug}/items`),
  adminList: (slug?: string) => api.get<ProductItem[]>('/admin/product-items', { params: slug ? { service_slug: slug } : {} }),
  create: (data: ProductItemCreate) => api.post<ProductItem>('/admin/product-items', data),
  update: (id: string, data: ProductItemUpdate) => api.put<ProductItem>(`/admin/product-items/${id}`, data),
  delete: (id: string) => api.delete(`/admin/product-items/${id}`),
};

// ── Projects ───────────────────────────────────────────────────────────────────
export const projectsApi = {
  list: (serviceSlug?: string) =>
    api.get<ProjectListItem[]>('/projects', { params: serviceSlug ? { service_slug: serviceSlug } : {} }),
  get: (slug: string) => api.get<Project>(`/projects/${slug}`),
  adminList: () => api.get<ProjectListItem[]>('/admin/projects'),
  create: (data: ProjectCreate) => api.post<Project>('/admin/projects', data),
  update: (id: string, data: ProjectUpdate) =>
    api.put<Project>(`/admin/projects/${id}`, data),
  delete: (id: string) => api.delete(`/admin/projects/${id}`),
  toggleFeature: (id: string, is_featured: boolean) =>
    api.patch<Project>(`/admin/projects/${id}/feature`, { is_featured }),
  addImage: (id: string, data: ProjectImageCreate) =>
    api.post<ProjectImage>(`/admin/projects/${id}/images`, data),
  removeImage: (id: string, imgId: string) =>
    api.delete(`/admin/projects/${id}/images/${imgId}`),
  reorderImages: (id: string, items: ReorderItem[]) =>
    api.patch<ProjectImage[]>(`/admin/projects/${id}/images/reorder`, { items }),
};

// ── Team ───────────────────────────────────────────────────────────────────────
export const teamApi = {
  list: () => api.get<TeamMember[]>('/team'),
  adminList: () => api.get<TeamMember[]>('/admin/team'),
  create: (data: TeamMemberCreate) => api.post<TeamMember>('/admin/team', data),
  update: (id: string, data: TeamMemberUpdate) =>
    api.put<TeamMember>(`/admin/team/${id}`, data),
  delete: (id: string) => api.delete(`/admin/team/${id}`),
  reorder: (items: ReorderItem[]) =>
    api.patch<TeamMember[]>('/admin/team/reorder', { items }),
};

// ── Clients ────────────────────────────────────────────────────────────────────
export const clientsApi = {
  list: () => api.get<Client[]>('/clients'),
  adminList: () => api.get<Client[]>('/admin/clients'),
  create: (data: ClientCreate) => api.post<Client>('/admin/clients', data),
  update: (id: string, data: ClientUpdate) =>
    api.put<Client>(`/admin/clients/${id}`, data),
  delete: (id: string) => api.delete(`/admin/clients/${id}`),
  reorder: (items: ReorderItem[]) =>
    api.patch<Client[]>('/admin/clients/reorder', { items }),
};

// ── Testimonials ───────────────────────────────────────────────────────────────
export const testimonialsApi = {
  list: () => api.get<Testimonial[]>('/testimonials'),
  adminList: () => api.get<Testimonial[]>('/admin/testimonials'),
  create: (data: TestimonialCreate) =>
    api.post<Testimonial>('/admin/testimonials', data),
  update: (id: string, data: TestimonialUpdate) =>
    api.put<Testimonial>(`/admin/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/admin/testimonials/${id}`),
  reorder: (items: ReorderItem[]) =>
    api.patch<Testimonial[]>('/admin/testimonials/reorder', { items }),
};

// ── Jobs ───────────────────────────────────────────────────────────────────────
export const jobsApi = {
  list: () => api.get<JobOpening[]>('/jobs'),
  get: (id: string) => api.get<JobOpening>(`/jobs/${id}`),
  apply: (id: string, data: JobApplicationCreate) =>
    api.post<JobApplication>(`/jobs/${id}/apply`, data),
  adminList: () => api.get<JobOpening[]>('/admin/jobs'),
  create: (data: JobOpeningCreate) => api.post<JobOpening>('/admin/jobs', data),
  update: (id: string, data: JobOpeningUpdate) =>
    api.put<JobOpening>(`/admin/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/admin/jobs/${id}`),
  toggle: (id: string, is_open: boolean) =>
    api.patch<JobOpening>(`/admin/jobs/${id}/toggle`, { is_open }),
  getApplications: (id: string) =>
    api.get<JobApplication[]>(`/admin/jobs/${id}/applications`),
};

// ── Applications ───────────────────────────────────────────────────────────────
export const applicationsApi = {
  list: () => api.get<JobApplication[]>('/admin/applications'),
  markRead: (id: string) =>
    api.patch<JobApplication>(`/admin/applications/${id}/read`, { is_read: true }),
  delete: (id: string) => api.delete(`/admin/applications/${id}`),
};

// ── Certificates ───────────────────────────────────────────────────────────────
export const certificatesApi = {
  list: () => api.get<Certificate[]>('/certificates'),
  adminList: () => api.get<Certificate[]>('/admin/certificates'),
  create: (data: CertificateCreate) =>
    api.post<Certificate>('/admin/certificates', data),
  update: (id: string, data: CertificateUpdate) =>
    api.put<Certificate>(`/admin/certificates/${id}`, data),
  delete: (id: string) => api.delete(`/admin/certificates/${id}`),
  reorder: (items: ReorderItem[]) =>
    api.patch<Certificate[]>('/admin/certificates/reorder', { items }),
};

// ── Inquiries ──────────────────────────────────────────────────────────────────
export const inquiriesApi = {
  submit: (data: InquiryCreate) => api.post<Inquiry>('/inquiries', data),
  adminList: () => api.get<Inquiry[]>('/admin/inquiries'),
  get: (id: string) => api.get<Inquiry>(`/admin/inquiries/${id}`),
  markRead: (id: string, is_read: boolean) =>
    api.patch<Inquiry>(`/admin/inquiries/${id}/read`, { is_read }),
  delete: (id: string) => api.delete(`/admin/inquiries/${id}`),
};

// ── Settings ───────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => api.get<SiteSettings>('/settings'),
  adminGet: () => api.get<SiteSettings>('/admin/settings'),
  update: (data: SiteSettingsUpdate) =>
    api.put<SiteSettings>('/admin/settings', data),
  updateBrochure: (file_url: string) =>
    api.post<SiteSettings>('/admin/settings/brochure', { file_url }),
};

// ── Dashboard ──────────────────────────────────────────────────────────────────
export const dashboardApi = {
  get: () => api.get<DashboardResponse>('/admin/dashboard'),
};

// ── Upload ─────────────────────────────────────────────────────────────────────
export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ url: string; public_id: string }>('/admin/upload/image', form);
  },
  pdf: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ url: string; public_id: string }>('/admin/upload/pdf', form);
  },
  delete: (public_id: string) =>
    api.delete('/admin/upload', { data: { public_id } }),
};

export default api;
