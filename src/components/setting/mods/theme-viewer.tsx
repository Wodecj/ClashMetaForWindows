import { EditRounded } from '@mui/icons-material'
import {
  Button,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Box,
  styled,
  TextField,
  useTheme,
} from '@mui/material'
import { useLockFn } from 'ahooks'
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { BaseDialog, DialogRef } from '@/components/base'
import { EditorViewer } from '@/components/profile/editor-viewer'
import { useVerge } from '@/hooks/use-verge'
import { defaultDarkTheme, defaultTheme } from '@/pages/_theme'
import { showNotice } from '@/services/notice-service'
import { readWallpaper } from '@/utils/wallpaper'

export function ThemeViewer(props: { ref?: React.Ref<DialogRef> }) {
  const { ref } = props
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [cssEditorValue, setCssEditorValue] = useState('')
  const [cssEditorSavedValue, setCssEditorSavedValue] = useState('')
  const { verge, patchVerge } = useVerge()
  const { theme_setting } = verge ?? {}
  const [theme, setTheme] = useState(theme_setting || {})
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Latest theme ref to avoid stale closures when saving CSS
  const themeRef = useRef(theme)
  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true)
      setTheme({ ...theme_setting })
    },
    close: () => setOpen(false),
  }))

  const textProps = {
    size: 'small',
    autoComplete: 'off',
    sx: { width: 135 },
  } as const

  const handleChange = (field: keyof typeof theme) => (e: any) => {
    setTheme((t) => ({ ...t, [field]: e.target.value }))
  }

  const onSave = useLockFn(async () => {
    if (importing) return
    try {
      await patchVerge({ theme_setting: theme })
      setOpen(false)
    } catch (err) {
      showNotice.error(err)
    }
  })

  const { palette } = useTheme()

  const dt = palette.mode === 'light' ? defaultTheme : defaultDarkTheme

  type ThemeKey = keyof typeof theme & keyof typeof defaultTheme

  const fieldDefinitions: Array<{ labelKey: string; key: ThemeKey }> = useMemo(
    () => [
      {
        labelKey: 'settings.components.verge.theme.fields.primaryColor',
        key: 'primary_color',
      },
      {
        labelKey: 'settings.components.verge.theme.fields.secondaryColor',
        key: 'secondary_color',
      },
      {
        labelKey: 'settings.components.verge.theme.fields.primaryText',
        key: 'primary_text',
      },
      {
        labelKey: 'settings.components.verge.theme.fields.secondaryText',
        key: 'secondary_text',
      },
      {
        labelKey: 'settings.components.verge.theme.fields.infoColor',
        key: 'info_color',
      },
      {
        labelKey: 'settings.components.verge.theme.fields.warningColor',
        key: 'warning_color',
      },
      {
        labelKey: 'settings.components.verge.theme.fields.errorColor',
        key: 'error_color',
      },
      {
        labelKey: 'settings.components.verge.theme.fields.successColor',
        key: 'success_color',
      },
    ],
    [],
  )

  const openCssEditor = () => {
    const nextCss = themeRef.current?.css_injection ?? ''
    setCssEditorValue(nextCss)
    setCssEditorSavedValue(nextCss)
    setEditorOpen(true)
  }

  const handleSaveCss = useLockFn(async () => {
    const prevTheme = themeRef.current || {}
    setTheme({ ...prevTheme, css_injection: cssEditorValue })
    setCssEditorSavedValue(cssEditorValue)
  })

  const renderItem = (labelKey: string, key: ThemeKey) => {
    const label = t(labelKey)
    return (
      <Item key={key}>
        <ListItemText primary={label} />
        <Round sx={{ background: theme[key] || dt[key] }} />
        <TextField
          {...textProps}
          value={theme[key] ?? ''}
          placeholder={dt[key]}
          onChange={handleChange(key)}
          onKeyDown={(e) => e.key === 'Enter' && onSave()}
        />
      </Item>
    )
  }

  return (
    <BaseDialog
      open={open}
      title={t('settings.components.verge.theme.title')}
      okBtn={t('shared.actions.save')}
      cancelBtn={t('shared.actions.cancel')}
      contentSx={{ width: 400, maxHeight: 505, overflow: 'auto', pb: 0 }}
      onClose={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      onOk={onSave}
    >
      <List sx={{ pt: 0 }}>
        <Item>
          <ListItemText
            primary={t(
              'settings.components.verge.theme.fields.backgroundImage',
            )}
          />
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/png,image/jpeg,image/webp,image/bmp"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (!file) return
              setImporting(true)
              try {
                const image = await readWallpaper(file)
                setTheme((current) => ({ ...current, background_image: image }))
              } catch (error) {
                showNotice.error(error)
              } finally {
                setImporting(false)
              }
            }}
          />
          <Button
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            {t('settings.components.verge.theme.actions.chooseImage')}
          </Button>
          <Button
            disabled={importing || !theme.background_image}
            onClick={() =>
              setTheme((current) => ({
                ...current,
                background_image: '',
                background_fit: 'contain',
                background_opacity: 0.3,
              }))
            }
          >
            {t('settings.components.verge.theme.actions.removeImage')}
          </Button>
        </Item>
        {theme.background_image && (
          <>
            <Box
              component="img"
              src={theme.background_image}
              alt={t('settings.components.verge.theme.fields.backgroundImage')}
              sx={{ width: '100%', height: 120, objectFit: 'contain' }}
            />
            <Item>
              <ListItemText
                primary={t(
                  'settings.components.verge.theme.fields.backgroundFit',
                )}
              />
              <Select
                size="small"
                value={theme.background_fit ?? 'contain'}
                onChange={(event) =>
                  setTheme((current) => ({
                    ...current,
                    background_fit: event.target.value as
                      | 'contain'
                      | 'cover'
                      | 'stretch',
                  }))
                }
              >
                <MenuItem value="contain">
                  {t('settings.components.verge.theme.fit.contain')}
                </MenuItem>
                <MenuItem value="cover">
                  {t('settings.components.verge.theme.fit.cover')}
                </MenuItem>
                <MenuItem value="stretch">
                  {t('settings.components.verge.theme.fit.stretch')}
                </MenuItem>
              </Select>
            </Item>
            <Item sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <ListItemText
                primary={`${t('settings.components.verge.theme.fields.backgroundOpacity')}: ${Math.round((theme.background_opacity ?? 0.3) * 100)}%`}
                secondary={t(
                  'settings.components.verge.theme.fields.backgroundHint',
                )}
              />
              <Slider
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                aria-label={t(
                  'settings.components.verge.theme.fields.backgroundOpacity',
                )}
                value={Math.round((theme.background_opacity ?? 0.3) * 100)}
                onChange={(_, value) =>
                  setTheme((current) => ({
                    ...current,
                    background_opacity: (value as number) / 100,
                  }))
                }
              />
            </Item>
          </>
        )}
        {fieldDefinitions.map((field) => renderItem(field.labelKey, field.key))}

        <Item>
          <ListItemText
            primary={t('settings.components.verge.theme.fields.fontFamily')}
          />
          <TextField
            {...textProps}
            value={theme.font_family ?? ''}
            onChange={handleChange('font_family')}
            onKeyDown={(e) => e.key === 'Enter' && onSave()}
          />
        </Item>
        <Item>
          <ListItemText
            primary={t('settings.components.verge.theme.fields.cssInjection')}
          />
          <Button
            startIcon={<EditRounded />}
            variant="outlined"
            onClick={openCssEditor}
          >
            {t('settings.components.verge.theme.actions.editCss')}
          </Button>
          {editorOpen && (
            <EditorViewer
              open={true}
              title={t('settings.components.verge.theme.dialogs.editCssTitle')}
              value={cssEditorValue}
              language="css"
              path="theme-css.css"
              dirty={cssEditorValue !== cssEditorSavedValue}
              onChange={setCssEditorValue}
              onSave={handleSaveCss}
              onClose={() => {
                setEditorOpen(false)
              }}
            />
          )}
        </Item>
      </List>
    </BaseDialog>
  )
}

const Item = styled(ListItem)(() => ({
  padding: '5px 2px',
}))

const Round = styled('div')(() => ({
  width: '24px',
  height: '24px',
  borderRadius: '18px',
  display: 'inline-block',
  marginRight: '8px',
}))
