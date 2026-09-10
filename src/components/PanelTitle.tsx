function PanelTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: string }) {
  return (
    <div className="panel-title">
      <h2>
        {title}
        {subtitle ? <span>{subtitle}</span> : null}
      </h2>
      {action ? <button type="button">{action}</button> : null}
    </div>
  );
}

export default PanelTitle;
