import { QRCodeSVG } from 'qrcode.react';
import { PRESET_COLORS } from '../constants';

interface IProps {
  url: string;
  fgColor: string;
  onTextChange: (value: string) => void;
  onPresetChange: (value: string) => void;
}

export const QrCodeCanvas = ({
  url,
  fgColor,
  onTextChange,
  onPresetChange,
}: IProps) => {
  const renderPresetColours = (): JSX.Element[] => {
    return PRESET_COLORS.map((color) => (
      <button
        className="h-9 w-9 rounded-full"
        style={{ backgroundColor: color }}
        onClick={() => onPresetChange(color)}
      />
    ));
  };

  return (
    <div className="flex w-full flex-col items-center space-y-4">
      <div className="input-group w-full">
        <div
          className={`h-auto w-1/6 rounded-l-lg bg-[${fgColor}]`}
          style={{ backgroundColor: fgColor }}
        />
        <input
          className="input input-bordered w-5/6 px-3 italic placeholder:text-sm focus:outline-none"
          placeholder="#000000"
          type="text"
          value={fgColor}
          onChange={(e) => onTextChange(e.target.value)}
        />
      </div>
      <div className="flex w-full">
        <div className="flex w-1/2 flex-col space-y-3">
          <div>
            <span className="font-semibold">Presets </span>
            <span className="italic">(optional)</span>
          </div>
          <div className="grid w-full grid-cols-3 gap-4">
            {renderPresetColours()}
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <span className="font-semibold">Preview</span>
          <div className="rounded-lg border border-base-content/20 p-4">
            <QRCodeSVG value={url} fgColor={fgColor} />
          </div>
        </div>
      </div>
    </div>
  );
};
