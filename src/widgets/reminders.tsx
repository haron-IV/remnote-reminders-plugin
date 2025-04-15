import { usePlugin, renderWidget, SelectionType } from '@remnote/plugin-sdk';

function SelectedTextDictionary() {
  const plugin = usePlugin()

  return <div>Hello World!</div>;
}

renderWidget(SelectedTextDictionary);
