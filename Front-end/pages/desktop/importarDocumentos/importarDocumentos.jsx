import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import MenuGlobal from '../../../components/MenuGlobal/MenuGlobal';
import { usePreferences, useThemedStyles } from '../../../context/PreferencesContext';
import { createStyles } from './importarDocumentosStyle';

const LOCALES = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
const TIPOS = ['notaFiscal', 'contrato', 'laudo', 'recibo', 'exame', 'receita', 'boleto', 'outro'];
const EXTENSOES = ['pdf', 'jpg', 'jpeg', 'png', 'tgf'];

const extensaoValida = (nome) => {
  const ext = nome.split('.').pop().toLowerCase();
  return EXTENSOES.includes(ext);
};

const formatarTamanho = (bytes, locale) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString(locale, { maximumFractionDigits: 1 })} MB`;
};

export default function ImportarDocumentos({ activeMenu = 'documentos', onNavigate, onBack, onImport }) {
  const { colors, t, language } = usePreferences();
  const styles = useThemedStyles(createStyles);
  const locale = LOCALES[language] || 'pt-BR';

  const [arquivos, setArquivos] = useState([]);
  const [tipo, setTipo] = useState(null);
  const [aberto, setAberto] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const dropRef = useRef(null);

  const adicionarArquivos = (lista) => {
    const validos = lista.filter((a) => extensaoValida(a.name));
    setArquivos((atual) => [...atual, ...validos]);
  };

  const selecionar = async () => {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png', '*/*'],
      multiple: true,
      copyToCacheDirectory: false,
    });
    if (resultado.canceled) return;
    adicionarArquivos(resultado.assets);
  };

  const remover = (indice) => {
    setArquivos((atual) => atual.filter((_, i) => i !== indice));
  };

  useEffect(() => {
    const el = dropRef.current;
    if (!el || !el.addEventListener) return;

    const sobre = (e) => {
      e.preventDefault();
      setArrastando(true);
    };
    const sair = (e) => {
      e.preventDefault();
      setArrastando(false);
    };
    const soltar = (e) => {
      e.preventDefault();
      setArrastando(false);
      const soltos = Array.from(e.dataTransfer.files).map((f) => ({
        name: f.name,
        size: f.size,
        file: f,
      }));
      adicionarArquivos(soltos);
    };

    el.addEventListener('dragover', sobre);
    el.addEventListener('dragleave', sair);
    el.addEventListener('drop', soltar);
    return () => {
      el.removeEventListener('dragover', sobre);
      el.removeEventListener('dragleave', sair);
      el.removeEventListener('drop', soltar);
    };
  }, []);

  const podeImportar = arquivos.length > 0 && !!tipo;

  const iniciar = () => {
    if (!podeImportar) return;
    if (onImport) onImport(arquivos, tipo);
  };

  return (
    <View style={styles.container}>
      <MenuGlobal activeMenu={activeMenu} onNavigate={onNavigate} />
      <ScrollView style={styles.main} contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
        <Pressable
          style={({ hovered }) => [styles.botaoVoltar, hovered && styles.botaoVoltarHover]}
          onPress={onBack}
          accessibilityLabel={t('imp.voltar')}
        >
          <Ionicons name="arrow-back-outline" size={18} color={colors.onPrimary} />
        </Pressable>

        <View style={styles.titleRow}>
          <Ionicons name="cloud-upload-outline" size={32} color={colors.text} style={styles.titleIcon} />
          <Text style={styles.title}>{t('imp.titulo')}</Text>
        </View>
        <Text style={styles.subtitle}>{t('imp.subtitulo')}</Text>

        <View style={styles.card}>
          <Pressable
            onPress={selecionar}
            style={({ hovered }) => [
              styles.areaUpload,
              (hovered || arrastando) && styles.areaUploadAtiva,
            ]}
          >
            <View ref={dropRef} style={styles.areaUploadInterna}>
              <View style={styles.circuloIcone}>
                <Ionicons name="cloud-upload-outline" size={56} color={colors.accent} />
              </View>
              <Text style={styles.textoUpload}>{t('imp.arraste')}</Text>
              <Text style={styles.textoAjuda}>{t('imp.clique')}</Text>
              <View style={styles.formatos}>
                {['PDF', 'JPG', 'PNG', 'TGF'].map((f) => (
                  <View key={f} style={styles.formatoTag}>
                    <Text style={styles.formatoTexto}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>

          {arquivos.length > 0 && (
            <View style={styles.listaArquivos}>
              <Text style={styles.listaTitulo}>
                {arquivos.length} {arquivos.length === 1 ? t('imp.umArquivo') : t('imp.variosArquivos')}
              </Text>
              {arquivos.map((arq, i) => (
                <View key={`${arq.name}-${i}`} style={styles.itemArquivo}>
                  <View style={styles.itemIcone}>
                    <Ionicons name="document-text-outline" size={18} color={colors.accent} />
                  </View>
                  <Text style={styles.nomeArquivo} numberOfLines={1}>
                    {arq.name}
                  </Text>
                  <Text style={styles.tamanhoArquivo}>{formatarTamanho(arq.size, locale)}</Text>
                  <Pressable onPress={() => remover(i)} accessibilityLabel={t('imp.remover')} style={styles.botaoRemover}>
                    <Ionicons name="close-outline" size={18} color={colors.text} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.seletorWrapper}>
          <Pressable
            style={({ hovered }) => [styles.seletor, (hovered || aberto) && styles.seletorAtivo]}
            onPress={() => setAberto(!aberto)}
          >
            <Ionicons name="document-text-outline" size={18} color={colors.accent} />
            <Text style={[styles.seletorTexto, tipo && styles.seletorTextoSelecionado]}>
              {tipo ? t(`imp.t.${tipo}`) : t('imp.selecionarTipo')}
            </Text>
            <Ionicons name={aberto ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color={colors.text} />
          </Pressable>

          {aberto && (
            <View style={styles.opcoes}>
              {TIPOS.map((item) => (
                <Pressable
                  key={item}
                  style={({ hovered }) => [styles.opcao, hovered && styles.opcaoHover]}
                  onPress={() => {
                    setTipo(item);
                    setAberto(false);
                  }}
                >
                  <Text style={[styles.opcaoTexto, item === tipo && styles.opcaoTextoSelecionada]}>
                    {t(`imp.t.${item}`)}
                  </Text>
                  {item === tipo && <Ionicons name="checkmark-outline" size={18} color={colors.accent} />}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <Pressable
          onPress={iniciar}
          disabled={!podeImportar}
          style={({ hovered }) => [
            styles.botaoImportar,
            hovered && podeImportar && styles.botaoImportarHover,
            !podeImportar && styles.botaoImportarDesativado,
          ]}
        >
          <Ionicons name="play-outline" size={20} color={colors.onPrimary} />
          <Text style={styles.botaoImportarTexto}>{t('imp.iniciar')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}