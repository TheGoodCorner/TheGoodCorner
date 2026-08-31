import { Link } from 'react-router-dom';
import { LegalPageLayout, LegalSection } from '../components/layouts/LegalPageLayout';

const SECTIONS = [
  { id: 'qui-sommes-nous', label: 'Qui sommes-nous' },
  { id: 'donnees-collectees', label: 'Données que nous collectons' },
  { id: 'finalites', label: 'Pourquoi nous les utilisons' },
  { id: 'base-legale', label: 'Base légale' },
  { id: 'destinataires', label: 'Qui y a accès' },
  { id: 'conservation', label: 'Durée de conservation' },
  { id: 'cookies', label: 'Cookies et stockage local' },
  { id: 'droits', label: 'Vos droits' },
  { id: 'securite', label: 'Sécurité' },
  { id: 'mineurs', label: 'Âge minimum' },
  { id: 'modifications', label: 'Modifications' },
  { id: 'contact', label: 'Contact' },
];

function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Politique de confidentialité" lastUpdated="31 août 2026" sections={SECTIONS}>
      <LegalSection id="qui-sommes-nous" title="Qui sommes-nous">
        <p>
          TheGoodCorner est une marketplace qui met en relation des particuliers pour l'achat et la vente
          d'articles d'occasion (matériel de sport, entraînement, combat...). Cette politique explique quelles
          données nous collectons lorsque vous utilisez le site, pourquoi, et quels droits vous pouvez exercer.
        </p>
        <p>
          Pour toute question sur vos données personnelles, vous pouvez nous écrire à{' '}
          <a href="mailto:contact@thegoodcorner.fr" className="text-[var(--color-primary)] hover:underline">
            contact@thegoodcorner.fr
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="donnees-collectees" title="Données que nous collectons">
        <p>Selon votre usage du site, nous collectons :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Données de compte</strong> : email, mot de passe (jamais stocké en clair), nom d'utilisateur.</li>
          <li><strong>Données de profil (optionnelles)</strong> : numéro de téléphone, adresse (pays, région, ville, rue, numéro, complément), photo de profil, biographie.</li>
          <li><strong>Données liées à votre activité</strong> : produits que vous publiez (nom, description, prix, catégorie, photo), avis que vous laissez à d'autres utilisateurs (note, commentaire), messages échangés avec d'autres membres via la messagerie.</li>
          <li><strong>Données techniques</strong> : préférence de thème (clair/sombre), contenu de votre panier, aperçu de vos conversations — stockées localement dans votre navigateur (voir la section Cookies ci-dessous).</li>
        </ul>
        <p>
          Nous ne collectons aucune donnée bancaire : le paiement en ligne n'est pas encore disponible sur la
          plateforme à ce stade du projet (voir les{' '}
          <Link to="/conditions-generales#fonctionnement" className="text-[var(--color-primary)] hover:underline">
            CGU
          </Link>
          ).
        </p>
      </LegalSection>

      <LegalSection id="finalites" title="Pourquoi nous les utilisons">
        <ul className="list-disc pl-5 space-y-1">
          <li>Créer et gérer votre compte, vous authentifier.</li>
          <li>Vous permettre de publier des annonces, laisser des avis et échanger des messages avec d'autres utilisateurs.</li>
          <li>Afficher votre profil vendeur (public) aux autres membres.</li>
          <li>Mémoriser vos préférences (thème, panier) pour une expérience plus fluide.</li>
        </ul>
        <p>Nous n'utilisons pas vos données à des fins de prospection commerciale, de publicité ciblée ou de revente à des tiers.</p>
      </LegalSection>

      <LegalSection id="base-legale" title="Base légale">
        <p>
          Le traitement de vos données repose sur l'exécution du contrat qui nous lie (création de compte,
          utilisation des fonctionnalités de la marketplace) et, pour le stockage local non essentiel
          (thème, panier), sur votre consentement implicite à l'usage du site.
        </p>
      </LegalSection>

      <LegalSection id="destinataires" title="Qui y a accès">
        <p>
          Votre email, votre adresse et votre numéro de téléphone ne sont jamais visibles par les autres
          utilisateurs. Seul votre profil public est visible des autres membres : nom d'utilisateur, avatar,
          biographie, note vendeur, et produits que vous avez publiés.
        </p>
        <p>Vos données ne sont partagées avec aucun prestataire publicitaire ou analytique tiers.</p>
      </LegalSection>

      <LegalSection id="conservation" title="Durée de conservation">
        <p>
          Vos données sont conservées tant que votre compte est actif. Vous pouvez supprimer votre compte à
          tout moment depuis votre page Profil ; vos données de profil sont alors effacées. Pour toute question
          sur le devenir d'un contenu que vous avez publié et qui concerne d'autres utilisateurs (avis, messages),
          contactez-nous.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies et stockage local">
        <p>
          Nous utilisons un seul cookie, strictement nécessaire au fonctionnement du site, ainsi que le
          stockage local de votre navigateur (localStorage) pour le confort d'usage :
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
            <thead>
              <tr className="bg-[var(--color-surface-hover)] text-left">
                <th className="p-2 font-semibold">Nom</th>
                <th className="p-2 font-semibold">Type</th>
                <th className="p-2 font-semibold">Finalité</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[var(--color-border)]">
                <td className="p-2">Cookie de rafraîchissement</td>
                <td className="p-2">Cookie httpOnly (essentiel)</td>
                <td className="p-2">Garder votre session connectée sans redemander votre mot de passe</td>
              </tr>
              <tr className="border-t border-[var(--color-border)]">
                <td className="p-2">has_session</td>
                <td className="p-2">localStorage</td>
                <td className="p-2">Savoir si une session est potentiellement active au chargement</td>
              </tr>
              <tr className="border-t border-[var(--color-border)]">
                <td className="p-2">theme-storage</td>
                <td className="p-2">localStorage</td>
                <td className="p-2">Mémoriser le thème clair/sombre choisi</td>
              </tr>
              <tr className="border-t border-[var(--color-border)]">
                <td className="p-2">cart-storage</td>
                <td className="p-2">localStorage</td>
                <td className="p-2">Conserver le contenu de votre panier entre deux visites</td>
              </tr>
              <tr className="border-t border-[var(--color-border)]">
                <td className="p-2">message-storage</td>
                <td className="p-2">localStorage</td>
                <td className="p-2">Afficher rapidement l'aperçu de vos conversations au chargement de la messagerie</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Votre jeton d'authentification n'est, quant à lui, jamais stocké dans le navigateur : il vit
          uniquement en mémoire le temps de votre session et est régénéré via le cookie de rafraîchissement.
        </p>
        <p>Vous pouvez effacer ces données à tout moment depuis les paramètres de votre navigateur.</p>
      </LegalSection>

      <LegalSection id="droits" title="Vos droits">
        <p>Conformément au RGPD, vous disposez des droits suivants sur vos données :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Accès et rectification</strong> : modifiables directement depuis votre page Profil.</li>
          <li><strong>Effacement</strong> : suppression de votre compte via requette à un administrateur de TGC France (via le mail ci-dessous).</li>
          <li><strong>Opposition et limitation</strong> du traitement.</li>
          <li><strong>Portabilité</strong> de vos données.</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à{' '}
          <a href="mailto:contact@thegoodcorner.fr" className="text-[var(--color-primary)] hover:underline">
            contact@thegoodcorner.fr
          </a>
          . Vous disposez également d'un droit de réclamation auprès de la{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline">
            CNIL
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="securite" title="Sécurité">
        <p>
          Votre mot de passe est haché avant stockage — personne, pas même notre équipe, n'y a accès en
          clair. La connexion s'appuie sur un jeton de courte durée renouvelé via un cookie sécurisé
          (httpOnly), non accessible en JavaScript.
        </p>
      </LegalSection>

      <LegalSection id="mineurs" title="Âge minimum">
        <p>Le service est réservé aux personnes majeures (18 ans et plus).</p>
      </LegalSection>

      <LegalSection id="modifications" title="Modifications">
        <p>Cette politique peut évoluer. La date de dernière mise à jour est indiquée en haut de cette page.</p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Une question sur vos données ?{' '}
          <a href="mailto:contact@thegoodcorner.fr" className="text-[var(--color-primary)] hover:underline">
            contact@thegoodcorner.fr
          </a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

export default PrivacyPolicy;