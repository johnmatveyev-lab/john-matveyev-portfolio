export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
      is_archived?: boolean | null
      is_read?: boolean | null
      message?: string
      name?: string
    }
    Relationships: []
  }
      projects: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          featured: boolean | null
          gradient: string | null
          hero_image_url: string | null
          icon_name: string | null
          id: string
          live_url: string | null
          metrics: Json | null
          outcomes: string[] | null
          platform: string
          repo_url: string | null
          role: string | null
          slug: string | null
          summary: string | null
          tags: string[]
          tech: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          featured?: boolean | null
          gradient?: string | null
          hero_image_url?: string | null
          icon_name?: string | null
          id?: string
          live_url?: string | null
          metrics?: Json | null
          outcomes?: string[] | null
          platform: string
          repo_url?: string | null
          role?: string | null
          slug?: string | null
          summary?: string | null
          tags?: string[]
          tech?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          featured?: boolean | null
          gradient?: string | null
          hero_image_url?: string | null
          icon_name?: string | null
          id?: string
          live_url?: string | null
          metrics?: Json | null
          outcomes?: string[] | null
          platform?: string
          repo_url?: string | null
          role?: string | null
          slug?: string | null
          summary?: string | null
          tags?: string[]
          tech?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_submissions: {
        Row: {
          created_at: string | null
          edit_instructions: string[] | null
          id: string
          mockup_landing_page: string | null
          mockup_pages: Json | null
          project_audience: string | null
          project_category: string | null
          project_description: string | null
          project_design_style: string | null
          project_features: string[] | null
          project_key_features: string[] | null
          project_name: string
          project_platforms: string[] | null
          project_tagline: string | null
          project_tech_stack: string[] | null
          status: string
          user_company: string | null
          user_email: string
          user_name: string
          user_notes: string | null
          user_phone: string | null
        }
        Insert: {
          created_at?: string | null
          edit_instructions?: string[] | null
          id?: string
          mockup_landing_page?: string | null
          mockup_pages?: Json | null
          project_audience?: string | null
          project_category?: string | null
          project_description?: string | null
          project_design_style?: string | null
          project_features?: string[] | null
          project_key_features?: string[] | null
          project_name: string
          project_platforms?: string[] | null
          project_tagline?: string | null
          project_tech_stack?: string[] | null
          status?: string
          user_company?: string | null
          user_email: string
          user_name: string
          user_notes?: string | null
          user_phone?: string | null
        }
        Update: {
          created_at?: string | null
          edit_instructions?: string[] | null
          id?: string
          mockup_landing_page?: string | null
          mockup_pages?: Json | null
          project_audience?: string | null
          project_category?: string | null
          project_description?: string | null
          project_design_style?: string | null
          project_features?: string[] | null
          project_key_features?: string[] | null
          project_name?: string
          project_platforms?: string[] | null
          project_tagline?: string | null
          project_tech_stack?: string[] | null
          status?: string
          user_company?: string | null
          user_email?: string
          user_name?: string
          user_notes?: string | null
          user_phone?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          quote: string
          rating: number | null
          role: string
          sort_order: number | null
          visible: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name: string
          quote: string
          rating?: number | null
          role: string
          sort_order?: number | null
          visible?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          quote?: string
          rating?: number | null
          role?: string
          sort_order?: number | null
          visible?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
