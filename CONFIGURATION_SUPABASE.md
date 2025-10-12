# 🚀 Configuration Supabase pour RizeAppHub™

## 📋 Étapes de Configuration

### 1️⃣ Créer les Tables dans Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet : `kwzurhhbvfkrvhbcdhwi`
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Cliquez sur **New Query**
5. Copiez-collez le contenu du fichier `SUPABASE_COMPLETE_SETUP.sql`
6. Cliquez sur **RUN** pour exécuter le script

### 2️⃣ Vérifier que les Tables sont Créées

Après avoir exécuté le script, vérifiez que ces tables existent :

- ✅ `user_profiles` - Profils utilisateurs
- ✅ `admin_codes` - Codes d'accès admin
- ✅ `calendar_events` - Événements du calendrier
- ✅ `user_tokens` - Système de tokens pour réservations
- ✅ `call_details` - Détails des appels
- ✅ `call_notes` - Notes pour les appels
- ✅ `call_history` - Historique complet des appels

### 3️⃣ Codes Admin Configurés

Les codes admin suivants sont automatiquement créés :

| Code | Nom | Niveau | Description |
|------|-----|--------|-------------|
| `admin123` | Admin Principal | admin | Accès administrateur standard |
| `smartapp2024` | RizeAppHub 2024 | admin | Accès RizeAppHub™ 2024 |
| `academy2024` | Academy 2024 | admin | Accès académie 2024 |
| `master2024` | Master 2024 | super_admin | Accès master avec privilèges étendus |
| `superadmin` | Super Admin | super_admin | Accès super administrateur |

### 4️⃣ Comment Utiliser les Codes Admin

#### Pour accéder au Dashboard Admin :

1. Allez sur la page d'accueil de RizeAppHub™
2. Cliquez sur le petit bouton **"Admin"** en haut à droite (discret, en gris)
3. Entrez un des codes admin (exemple : `admin123`)
4. Vous serez redirigé vers `/admin-dashboard`

#### Pour gérer les utilisateurs :

- Le dashboard admin affiche automatiquement tous les utilisateurs inscrits
- Les utilisateurs sont synchronisés automatiquement depuis `auth.users` vers `user_profiles`
- Rafraîchissement automatique toutes les 30 secondes

### 5️⃣ Protection des Routes

Les routes suivantes sont maintenant **protégées** et nécessitent une authentification :

- 🔒 `/onboarding` - Accessible uniquement après connexion
- 🔒 `/dashboard` - Accessible uniquement après connexion

Si un utilisateur non connecté essaie d'accéder à ces pages, il sera automatiquement redirigé vers la page d'accueil.

### 6️⃣ Authentification Utilisateur

#### Inscription :

1. Cliquez sur **"Je m'inscris"** sur la page d'accueil
2. Remplissez le formulaire avec :
   - Email
   - Mot de passe (minimum 6 caractères)
   - Nom complet (optionnel)
3. Un profil utilisateur est **automatiquement créé** dans `user_profiles`
4. L'utilisateur est redirigé vers `/onboarding`

#### Connexion :

1. Cliquez sur **"Connection"** sur la page d'accueil
2. Entrez vos identifiants
3. Vous êtes redirigé vers `/onboarding` puis `/dashboard`

#### Déconnexion :

- Cliquez sur **"Déconnexion"** dans le sidebar
- Vous êtes redirigé vers la page d'accueil
- Votre session est supprimée

### 7️⃣ Configuration Actuelle

**URL Supabase :** `https://kwzurhhbvfkrvhbcdhwi.supabase.co`
**Clé Anon :** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Ces credentials sont configurés dans :
- `client/src/lib/supabase.ts`

### 8️⃣ Fonctionnalités Implémentées

✅ **Système d'authentification complet**
- Inscription avec email/password
- Connexion sécurisée
- Gestion de session
- Protection des routes

✅ **Dashboard Admin**
- Accès par codes admin
- Liste de tous les utilisateurs
- Statistiques en temps réel
- Gestion des appels

✅ **Système de tokens**
- 1 token par semaine pour réserver un appel
- Réinitialisation automatique chaque lundi
- Historique des utilisations

✅ **Calendrier intégré**
- Création d'événements
- Gestion des rendez-vous
- Synchronisation avec Cal.com

✅ **Historique des appels**
- Enregistrement de tous les appels
- Notes personnalisées
- Statuts (programmé, complété, annulé)

### 9️⃣ Tests de Sécurité

Pour vérifier que la protection fonctionne :

1. **Test 1 - Accès sans connexion**
   - Ouvrez un navigateur en navigation privée
   - Allez sur `http://localhost:5000/dashboard`
   - ✅ Vous devez être redirigé vers `/`

2. **Test 2 - Connexion normale**
   - Créez un compte utilisateur
   - Vous devez être redirigé vers `/onboarding`
   - Puis vers `/dashboard` après onboarding

3. **Test 3 - Code admin**
   - Cliquez sur "Admin" en haut à droite
   - Entrez `admin123`
   - ✅ Accès au dashboard admin

### 🔟 Support & Troubleshooting

#### Problème : Les tables ne sont pas créées

**Solution :**
```sql
-- Vérifiez que le script SQL s'est exécuté correctement
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

#### Problème : Les utilisateurs ne s'affichent pas dans le dashboard admin

**Solution :**
```sql
-- Vérifiez que le trigger fonctionne
SELECT * FROM public.user_profiles;

-- Si vide, exécutez :
INSERT INTO public.user_profiles (user_id, email, full_name, created_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email, 'Utilisateur'),
    created_at
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
```

#### Problème : La protection des routes ne fonctionne pas

**Solution :**
- Vérifiez que vous êtes bien connecté via Supabase Auth
- Ouvrez la console du navigateur (F12) et vérifiez les erreurs
- Assurez-vous que la session Supabase est valide

---

## ✅ Résumé de la Configuration

🎉 **RizeAppHub™ est maintenant entièrement configuré avec :**

- ✅ Authentification Supabase complète
- ✅ Protection des routes dashboard et onboarding
- ✅ Système admin avec codes d'accès
- ✅ Base de données complète avec 7 tables
- ✅ Gestion automatique des profils utilisateurs
- ✅ Système de tokens pour les réservations
- ✅ Calendrier et historique des appels

**L'application est prête à être utilisée ! 🚀**

