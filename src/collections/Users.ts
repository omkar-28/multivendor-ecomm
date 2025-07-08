import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin } from '@/lib/access'

const defaultTenantsArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req?.user),
    update: ({ req }) => isSuperAdmin(req?.user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req?.user),
    update: ({ req }) => isSuperAdmin(req?.user),
  }
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req?.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true;
      // Allow users to update their own profile
      return req.user?.id === id;
    },
    delete: ({ req }) => isSuperAdmin(req?.user),
  },
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => {
      // Hide the collection from the admin panel if the user is not a super-admin
      return !isSuperAdmin(user);
    }
  },
  auth: true,
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ["user", "admin", "super-admin"],
      access: {
        update: ({ req }) => isSuperAdmin(req?.user),
      }
    },
    {
      ...defaultTenantsArrayField,
      admin: {
        ...(defaultTenantsArrayField?.admin || {}),
        position: 'sidebar',
      }
    }
  ],
}
